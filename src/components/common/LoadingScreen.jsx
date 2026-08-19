import { Flex, Spin } from 'antd';

export function LoadingScreen({ minHeight = '60vh' }) {
  return (
    <Flex align="center" justify="center" style={{ minHeight }}>
      <Spin size="large" />
    </Flex>
  );
}
