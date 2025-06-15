import sys
import os
# --- ФИНАЛЬНЫЕ ИСПРАВЛЕННЫЕ ИМПОРТЫ ---
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# --- Настройка ---
PERSIST_DIR = './project_db'
if not os.path.exists(PERSIST_DIR):
    print(f"Ошибка: Директория с базой данных '{PERSIST_DIR}' не найдена.")
    print("Пожалуйста, сначала запустите скрипт 'index_project.py' для создания базы.")
    sys.exit(1)

# --- Основная логика ---
# Загружаем модель для эмбеддингов
model_name = "sentence-transformers/all-MiniLM-L6-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}

try:
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )
except Exception as e:
    print(f"Ошибка при загрузке модели эмбеддингов: {e}")
    sys.exit(1)

# Загружаем существующую базу данных
db = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)

# Получаем вопрос из аргументов командной строки
query = sys.argv[1] if len(sys.argv) > 1 else "Что делают роуты в файле courses.js?"

print(f"Ваш вопрос: {query}\n")

# --- Ключевой шаг: Поиск релевантных документов ---
# Убираем переформулировку, так как пока она только мешает.
# Вернемся к ней, когда в коде появится больше деталей.
found_docs = db.similarity_search(query, k=4)

# --- Финальный вывод ---
print("--- Найденный контекст для LLM ---\n")
if not found_docs:
    print("Не удалось найти релевантные документы в базе знаний.")
else:
    for i, doc in enumerate(found_docs):
        source_path = doc.metadata.get('source', 'N/A').replace('\\', '/')
        print(f"--- Фрагмент {i+1} (из файла: {source_path}) ---\n")
        print(doc.page_content)
        print("\n" + "="*20 + "\n")