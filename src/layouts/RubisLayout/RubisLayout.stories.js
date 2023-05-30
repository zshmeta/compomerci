
  import React from 'react'; 
  import RubisLayout from './RubisLayout'; 
  export default { title: 'RubisLayout', compo: RubisLayout, }; 
  const Template = (args) => <RubisLayout {...args} />; 
  export const Basic = Template.bind({}); 
  export const WithProps = Template.bind({}); 
  WithProps.args = { text: 'Custom Text' };