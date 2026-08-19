import { Flex, Typography } from 'antd';

const { Title, Text } = Typography;

/** Title + optional subtitle on the left, actions on the right. */
export function PageHeader({ title, subtitle, extra }) {
  return (
    <Flex align="flex-start" justify="space-between" gap={16} wrap style={{ marginBottom: 24 }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle ? <Text type="secondary">{subtitle}</Text> : null}
      </div>
      {extra ? <Flex gap={8}>{extra}</Flex> : null}
    </Flex>
  );
}
