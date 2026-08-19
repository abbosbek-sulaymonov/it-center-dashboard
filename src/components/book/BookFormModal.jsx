import { Form, Input, InputNumber, Modal } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

export function BookFormModal({ open, book, submitting, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (book) form.setFieldsValue(book);
  }, [open, book, form]);

  return (
    <Modal
      open={open}
      title={book ? t('book.editTitle') : t('book.createTitle')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onSubmit)}
      destroyOnHidden
      width={640}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item name="title" label={t('book.title')} rules={[{ required: true, min: 2 }]}>
          <Input />
        </Form.Item>

        <Form.Item name="author" label={t('book.author')}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label={t('book.description')} rules={[{ required: true, min: 10 }]}>
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="category" label={t('book.category')}>
          <Input />
        </Form.Item>

        <Form.Item name="publishedYear" label={t('book.publishedYear')}>
          <InputNumber min={1400} max={2200} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="imageUrl" label={`${t('book.imageUrl')} (${t('common.optional')})`}>
          <Input placeholder="https://…" />
        </Form.Item>

        <Form.Item name="fileUrl" label={`${t('book.fileUrl')} (${t('common.optional')})`}>
          <Input placeholder="https://…" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
