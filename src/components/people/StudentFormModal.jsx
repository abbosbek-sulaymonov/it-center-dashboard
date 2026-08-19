import { DatePicker, Form, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function StudentFormModal({ open, student, submitting, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isEdit = Boolean(student);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (student) {
      form.setFieldsValue({
        fullName: student.user?.fullName,
        email: student.user?.email,
        phone: student.user?.phone,
        group: student.group,
        address: student.address,
        dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      });
    }
  }, [open, student, form]);

  // DatePicker hands back a dayjs object; the API expects an ISO string.
  const handleOk = () =>
    form.validateFields().then((values) =>
      onSubmit({
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
      }),
    );

  return (
    <Modal
      open={open}
      title={isEdit ? t('student.editTitle') : t('student.createTitle')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden
      width={600}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item name="fullName" label={t('auth.fullName')} rules={[{ required: true, min: 2 }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label={t('auth.email')} rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>

        {isEdit ? null : (
          <Form.Item name="password" label={t('auth.password')} rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item name="phone" label={t('auth.phone')}>
          <Input />
        </Form.Item>

        <Form.Item name="group" label={t('student.group')}>
          <Input placeholder="Frontend-24A" />
        </Form.Item>

        <Form.Item name="dateOfBirth" label={t('student.dateOfBirth')}>
          <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item name="address" label={t('student.address')}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
