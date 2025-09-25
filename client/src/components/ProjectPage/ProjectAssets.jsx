/**
 * @file components/ProjectPage/ProjectAssets.jsx
 * @description Компонент для отображения файлов проекта с возможностью предпросмотра и копирования ссылок.
 */
import React, { useState } from "react";

const ProjectAssets = ({ assets = [] }) => {
  const [copiedAsset, setCopiedAsset] = useState(null);

  const copyToClipboard = async (text, assetId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAsset(assetId);
      setTimeout(() => setCopiedAsset(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = fileName.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const isVideoFile = (fileName) => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
    const extension = fileName.split('.').pop().toLowerCase();
    return videoExtensions.includes(extension);
  };

  if (!assets || assets.length === 0) {
    return null;
  }

  return (
    <div className="project-assets">
      <h3>Файлы проекта</h3>
      <div className="assets-list">
        {assets.map((asset) => {
          const fileUrl = `http://localhost:5000${asset.file_url}`;
          return (
            <div key={asset.id} className="asset-item">
              <div className="asset-info">
                <div className="asset-name">{asset.file_name}</div>
                <div className="asset-url">{asset.file_url}</div>
              </div>
              
              <div className="asset-preview">
                {isImageFile(asset.file_name) && (
                  <img
                    src={fileUrl}
                    alt={asset.file_name}
                    className="asset-preview-image"
                    onClick={() => window.open(fileUrl, '_blank')}
                  />
                )}
                {isVideoFile(asset.file_name) && (
                  <video
                    src={fileUrl}
                    className="asset-preview-video"
                    controls
                    preload="metadata"
                  />
                )}
                {!isImageFile(asset.file_name) && !isVideoFile(asset.file_name) && (
                  <div className="asset-preview-file">
                    <span>📄</span>
                  </div>
                )}
              </div>

              <div className="asset-actions">
                <button
                  onClick={() => window.open(fileUrl, '_blank')}
                  className="asset-action-btn preview-btn"
                  title="Открыть в новой вкладке"
                >
                  👁️
                </button>
                <button
                  onClick={() => copyToClipboard(asset.file_url, asset.id)}
                  className="asset-action-btn copy-btn"
                  title="Копировать ссылку"
                >
                  {copiedAsset === asset.id ? '✓' : '📋'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectAssets;