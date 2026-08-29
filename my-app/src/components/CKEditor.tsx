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

  const initCKEditor = () => {
    if (typeof window !== 'undefined' && window.CKEDITOR) {
      if (editorInstanceRef.current) {
        return;
      }

      // Xóa instance cũ nếu tồn tại trong CKEDITOR
      if (window.CKEDITOR.instances[id]) {
        try {
          window.CKEDITOR.instances[id].destroy(true);
        } catch (e) {
          // ignore
        }
      }

      const textareaEl = document.getElementById(id);
      if (!textareaEl) return;

      try {
        const editor = window.CKEDITOR.replace(id, {
          height: 420,
          placeholder: placeholder,
          versionCheck: false,
          allowedContent: true, // Cho phép tất cả thẻ HTML và class Bootstrap
          extraPlugins: 'colorbutton,colordialog,font,justify,tableresize,tabletools,showblocks,div,find,iframe,preview,print',
          toolbar: [
            { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
            { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
            { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
            '/',
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
            '/',
            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
            { name: 'colors', items: ['TextColor', 'BGColor'] },
            { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
            { name: 'about', items: ['About'] }
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
      } catch (err) {
        console.error('Lỗi khi khởi tạo CKEditor:', err);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.CKEDITOR) {
        initCKEditor();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
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
        src="https://cdn.ckeditor.com/4.22.1/standard-all/ckeditor.js"
        strategy="afterInteractive"
        onLoad={initCKEditor}
      />
      <textarea
        id={id}
        name={id}
        defaultValue={value}
        className="form-control"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}
