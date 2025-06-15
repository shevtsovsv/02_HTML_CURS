import os
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# --- 1. Настройка ---
# Путь, где будет храниться векторная база данных
PERSIST_DIR = './project_db'

# Список папок, которые мы хотим проиндексировать
INCLUDE_DIRS = ['client', 'server'] 
# Список расширений файлов, которые нам интересны
ALLOWED_EXTENSIONS = ['.js', '.jsx', '.json', '.md']

print("Начинается индексация проекта...")

# --- 2. Новый, надежный способ сбора файлов ---
file_paths = []
for directory in INCLUDE_DIRS:
    for root, dirs, files in os.walk(directory):
        # Исключаем node_modules на уровне обхода
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
            
        for file in files:
            # Проверяем, что расширение файла в нашем списке разрешенных
            if any(file.endswith(ext) for ext in ALLOWED_EXTENSIONS):
                file_paths.append(os.path.join(root, file))

print(f"Найдено {len(file_paths)} файлов для индексации.")

if not file_paths:
    print("Документы не найдены. Проверьте настройки INCLUDE_DIRS и ALLOWED_EXTENSIONS.")
    exit()

# --- 3. Загрузка документов ---
all_docs = []
for file_path in file_paths:
    try:
        # Используем простой TextLoader для каждого файла
        loader = TextLoader(file_path, encoding='utf-8')
        all_docs.extend(loader.load())
    except Exception as e:
        # Если какой-то файл не удалось прочитать, мы просто пропустим его и выведем сообщение
        print(f"Пропущен файл (не удалось прочитать): {file_path}, ошибка: {e}")

print(f"Успешно загружено {len(all_docs)} документов.")


# --- 4. Разбиение документов на чанки ---
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
split_docs = text_splitter.split_documents(all_docs)

print(f"Документы разбиты на {len(split_docs)} чанков.")


# --- 5. Создание эмбеддингов ---
model_name = "sentence-transformers/all-MiniLM-L6-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}

embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

print("Модель для эмбеддингов загружена.")


# --- 6. Создание и сохранение векторной базы данных ---
# Перед созданием новой базы, удалим старую, чтобы избежать дублирования
if os.path.exists(PERSIST_DIR):
    import shutil
    print(f"Удаление старой базы данных в {PERSIST_DIR}...")
    shutil.rmtree(PERSIST_DIR)

db = Chroma.from_documents(
    split_docs,
    embeddings,
    persist_directory=PERSIST_DIR
)

print(f"\nБаза данных успешно создана и сохранена в {PERSIST_DIR}")