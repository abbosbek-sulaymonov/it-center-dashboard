import { Form, Modal, Select, Slider } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ENROLLMENT_STATUS } from '@/constants/roles.js';

export function EnrollmentFormModal({ open, enrollment, submitting, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !enrollment) return;
    form.setFieldsValue({ status: enrollment.status, progress: enrollment.progress });
  }, [open, enrollment, form]);

  return (
    <Modal
      open={open}
      title={t('enrollment.editTitle')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onSubmit)}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="status" label={t('common.status')}>
          <Select
            options={Object.values(ENROLLMENT_STATUS).map((status) => ({
              value: status,
              label: t(`enrollment.status.${status}`),
            }))}
          />
        </Form.Item>

        <Form.Item name="progress" label={t('enrollment.progress')}>
          <Slider min={0} max={100} step={5} tooltip={{ formatter: (value) => `${value}%` }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
