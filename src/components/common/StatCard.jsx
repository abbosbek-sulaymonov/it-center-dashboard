import { Card, Statistic } from 'antd';

export function StatCard({ title, value, prefix, suffix, precision }) {
  return (
    <Card variant="borderless" styles={{ body: { padding: 20 } }}>
      <Statistic title={title} value={value} prefix={prefix} suffix={suffix} precision={precision} />
    </Card>
  );
}
