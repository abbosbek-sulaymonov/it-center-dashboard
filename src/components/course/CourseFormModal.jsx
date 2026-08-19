import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { COURSE_LEVELS } from '@/constants/roles.js';

const { TextArea } = Input;

/**
 * Create/edit dialog for a course. `course` being null means "create".
 * `onSubmit` receives the raw form values and must return a promise.
 */
export function CourseFormModal({ open, course, tutors = [], submitting, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Refill whenever the dialog opens so a previous edit never leaks across.
  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(
      course
        ? { ...course, tutor: course.tutor?._id ?? course.tutor ?? '' }
        : { level: 'beginner', price: 0, durationWeeks: 8, capacity: 30, tutor: '' },
    );
  }, [open, course, form]);

  return (
    <Modal
      open={open}
      title={course ? t('course.editTitle') : t('course.createTitle')}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.validateFields().then(onSubmit)}
      destroyOnHidden
      width={640}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item name="title" label={t('course.title')} rules={[{ required: true, min: 3 }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label={t('course.description')} rules={[{ required: true, min: 10 }]}>
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="imageUrl" label={`${t('course.imageUrl')} (${t('common.optional')})`}>
          <Input placeholder="https://…" />
        </Form.Item>

        <Form.Item name="category" label={t('course.category')}>
          <Input />
        </Form.Item>

        <Form.Item name="level" label={t('course.level')} rules={[{ required: true }]}>
          <Select
            options={COURSE_LEVELS.map((level) => ({ value: level, label: t(`course.levels.${level}`) }))}
          />
        </Form.Item>

        <Form.Item name="tutor" label={t('course.tutor')}>
          <Select
            allowClear
            options={[
              { value: '', label: t('course.noTutor') },
              ...tutors.map((tutor) => ({
                value: tutor._id,
                label: tutor.user?.fullName ?? tutor.specialization,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item name="price" label={t('course.price')} rules={[{ required: true }]}>
          <InputNumber min={0} step={100000} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="durationWeeks" label={t('course.duration')} rules={[{ required: true }]}>
          <InputNumber min={1} max={104} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="capacity" label={t('course.capacity')} rules={[{ required: true }]}>
          <InputNumber min={1} max={500} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
