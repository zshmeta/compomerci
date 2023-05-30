
  import React from 'react'; 
  import SaphirPage from './SaphirPage'; 
  export default { title: 'SaphirPage', compo: SaphirPage, }; 
  const Template = (args) => <SaphirPage {...args} />; 
  export const Basic = Template.bind({}); 
  export const WithProps = Template.bind({}); 
  WithProps.args = { text: 'Custom Text' };