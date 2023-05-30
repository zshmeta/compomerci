
    import React, { lazy, Suspense } from 'react';
    
    const RubisLayoutWrapper = lazy(() => import('./RubisLayout'));
    
    const RubisLayout = (props) => (
      <Suspense fallback={<div>Loading...</div>}>
        <RubisLayoutWrapper {...props} />
      </Suspense>
    );
    
    export default RubisLayout;
    