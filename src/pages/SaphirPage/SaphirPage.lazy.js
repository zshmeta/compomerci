
    import React, { lazy, Suspense } from 'react';
    
    const SaphirPageWrapper = lazy(() => import('./SaphirPage'));
    
    const SaphirPage = (props) => (
      <Suspense fallback={<div>Loading...</div>}>
        <SaphirPageWrapper {...props} />
      </Suspense>
    );
    
    export default SaphirPage;
    