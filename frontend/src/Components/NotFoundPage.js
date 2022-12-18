import React, {useEffect} from 'react';
import {Text} from '@chakra-ui/react';

function NotFoundPage() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Text
        fontSize="6xl"
        fontWeight={700}
        style={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Page not found
      </Text>
    </div>
  );
}

export default NotFoundPage;