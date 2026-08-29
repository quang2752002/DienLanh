'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  id?: string;
}

declare global {
  interface Window {
    CKEDITOR?: any;
  }
}

export default function CKEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết...',
  id = 'ckeditor-textarea',
}: CKEditorProps) {
  const editorInstanceRef = useRef<any>(null);
  const isLoadedRef = useRef(false);

  const initCKEditor = () => {
    if (typeof window !== 'undefined' && window.CKEDITOR && !editorInstanceRef.current) {
      // Destroy existing instance if any
      if (window.CKEDITOR.instances[id]) {
        window.CKEDITOR.instances[id].destroy(true);
      }

      const editor = window.CKEDITOR.replace(id, {
        height: 350,
        placeholder: placeholder,
        toolbar: [
          { name: 'document', items: ['Source', '-', 'DocProps', 'Preview', 'Print'] },
          { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
          { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
          '/',
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
          { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
          { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'] },
          '/',
          { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
          { name: 'colors', items: ['TextColor', 'BGColor'] },
          { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
        ]
      });

      editor.on('instanceReady', () => {
        editor.setData(value || '');
      });

      editor.on('change', () => {
        const data = editor.getData();
        onChange(data);
      });

      editorInstanceRef.current = editor;
    }
  };

  useEffect(() => {
    if (window.CKEDITOR) {
      initCKEditor();
    }
    return () => {
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy(true);
        } catch (e) {
          // ignore
        }
        editorInstanceRef.current = null;
      }
    };
  }, [id]);

  // Cập nhật khi value từ ngoài thay đổi mà không phải do người dùng đang gõ
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.getData() !== value) {
      editorInstanceRef.current.setData(value || '');
    }
  }, [value]);

  return (
    <div>
      <Script
        src="https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js"
        strategy="lazyOnload"
        onLoad={() => {
          isLoadedRef.current = true;
          initCKEditor();
        }}
      />
      <textarea
        id={id}
        name={id}
        defaultValue={value}
        className="form-control"
        style={{ minHeight: '200px', display: 'none' }}
      />
    </div>
  );
}
