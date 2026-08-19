import { Form, Input, InputNumber, Modal } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

export function TutorFormModal({ open, tutor, submitting, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isEdit = Boolean(tutor);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (tutor) {
      form.setFieldsValue({
        fullName: tutor.user?.fullName,
        email: tutor.user?.email,
        phone: tutor.user?.phone,
        specialization: tutor.specialization,
        bio: tutor.bio,
        experienceYears: tutor.experienceYears,
      });
    }
  }, [open, tutor, form]);

  return (
    <Modal
      open={open}
      title={isEdit ? t('tutor.editTitle') : t('tutor.createTitle')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onSubmit)}
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

        {/* Passwords are only set at creation; changing one is the user's own action. */}
        {isEdit ? null : (
          <Form.Item name="password" label={t('auth.password')} rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item name="phone" label={t('auth.phone')}>
          <Input />
        </Form.Item>

        <Form.Item name="specialization" label={t('tutor.specialization')}>
          <Input />
        </Form.Item>

        <Form.Item name="experienceYears" label={t('tutor.experience')}>
          <InputNumber min={0} max={60} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="bio" label={t('tutor.bio')}>
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
