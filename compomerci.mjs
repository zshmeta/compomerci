import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline-sync';

// Ask the user what kind of component they want to create
const componentTypeOptions = ['Button', 'TextInput', 'Modal', 'None'];
const componentTypeIndex = readline.keyInSelect(componentTypeOptions, 'What kind of component would you like to create?');
const componentType = componentTypeOptions[componentTypeIndex];

// Ask the user if they want to use a styled component or a module.scss component
const componentStyleOptions = ['Styled Component', 'Module.scss Component'];
const componentStyleIndex = readline.keyInSelect(componentStyleOptions, 'Would you like to use a styled component or a module.scss component?');
const componentStyle = componentStyleOptions[componentStyleIndex];

// Ask the user if they want to create test units for their component
const createTestOptions = ['Yes', 'No'];
const createTestIndex = readline.keyInSelect(createTestOptions, 'Would you like to create test units for your component?');
const createTest = createTestOptions[createTestIndex];

// Ask the user if they want a lazyjs file for their component
const lazyOptions = ['Yes', 'No'];
const lazyIndex = readline.keyInSelect(lazyOptions, 'Would you like to create a lazyjs file for your component?');
const lazy = lazyOptions[lazyIndex];

// Ask the user if they want a story file with their component
const storyOptions = ['Yes', 'No'];
const storyIndex = readline.keyInSelect(storyOptions, 'Would you like to create a story file for your component?');
const story = storyOptions[storyIndex];

// Set default savePath
const savePathDefault = 'src/components';

// Set default componentName
const componentNameDefault = `compo${Math.floor(Math.random() * 100)}`;

// Ask the user where they want to save the component or use default
const savePath = readline.question(`Where would you like to save the component (default: ${savePathDefault})?`) || savePathDefault;

// Ask the user for the name of the component or use default
const componentName = readline.question(`What would you like to name the component (default: ${componentNameDefault})?`) || componentNameDefault;

// Create the component folder and files
const createComponent = (
  componentName,
  componentStyle,
  createTest,
  lazy,
  story,
  savePath,
) => {
  const componentPath = path.join(savePath, componentName);
  fs.mkdirSync(componentPath);

  // Create the component JS file
  const componentJS = `
  import React from 'react';
  ${componentStyle === "Styled Component" ? `import { ${componentName}Wrapper } from './${componentName}.styled';` : `import styles from './${componentName}.module.scss';`}
  
  const ${componentName} = ({ text }) => {
    return (
      <${componentStyle === "Styled Component" ? `${componentName}Wrapper` : `div className={styles.${componentName}}`}>
        {text || 'Default Text'}
      </${componentStyle === "Styled Component" ? `${componentName}Wrapper` : `div`}>
    );
  };
  
  export default ${componentName};
  `;
    fs.writeFileSync(
      path.join(componentPath, `${componentName}.jsx`),
      componentJS,
    );

  // Create the component CSS file
  if (componentStyle === 'Styled Component') {
    const componentCSS = `
import styled from 'styled-components';

export const ${componentName}Wrapper = styled.div\`
  display: block;
  padding: 10px;
  color: #fff;
  background-color: #000;
\``;
    fs.writeFileSync(
      path.join(componentPath, `${componentName}.styled.js`),
      componentCSS,
    );
  } else {
    const componentSCSS = `
.${componentName} {
  display: block;
  padding: 10px;
  color: #fff;
  background-color: #000;
}
`;
    fs.writeFileSync(
      path.join(componentPath, `${componentName}.module.scss`),
      componentSCSS,
    );
  }

  // Create the component story file if (story) {
if (story === 'Yes') {
  const componentStory = `import React from 'react'; import ${componentName} from './${componentName}'; export default { title: '${componentName}', component: ${componentName}, }; const Template = (args) => <${componentName} {...args} />; export const Basic = Template.bind({}); export const WithProps = Template.bind({}); WithProps.args = { text: 'Custom Text' };`;
  fs.writeFileSync(
    path.join(componentPath, `${componentName}.stories.js`),
    componentStory,
  );
}

  // Create the component test file if (createTest) {
    if (createTest === 'Yes') {
        const componentTest = `
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import '@testing-library/jest-dom/extend-expect';
    import ${componentName} from './${componentName}';
    
    describe('${componentName}', () => {
      it('renders the component with provided text', () => {
        const testText = 'Hello, World!';
        render(<${componentName} text={testText} />);
      
        expect(screen.getByText(testText)).toBeInTheDocument();
      });
    
      it('renders the component with default text if none provided', () => {
        render(<${componentName} />);
        
        expect(screen.getByText('Default Text')).toBeInTheDocument();
      });
    });
    `;
        fs.writeFileSync(
          path.join(componentPath, `${componentName}.test.js`),
          componentTest,
        );
      }

  // Create the component lazy file if (lazy) {
    if (lazy === 'Yes') {
        const componentLazy = `
    import React, { lazy, Suspense } from 'react';
    
    const ${componentName}Wrapper = lazy(() => import('./${componentName}'));
    
    const ${componentName} = (props) => (
      <Suspense fallback={<div>Loading...</div>}>
        <${componentName}Wrapper {...props} />
      </Suspense>
    );
    
    export default ${componentName};
    `;
        fs.writeFileSync(
          path.join(componentPath, `${componentName}.lazy.js`),
          componentLazy,
        );
      }

    // Create the component index file
      const componentIndex = `
      export { default } from './${componentName}';
      ${lazy === 'Yes' ? `export { default as ${componentName}Lazy } from './${componentName}.lazy'; `: ''}`;
      fs.writeFileSync(path.join(componentPath, 'index.js'),componentIndex,);
    

    // Create the component README file
    const componentReadmeTemplate = `
    # ${componentName}
    
    *by zshmeta*
    
    **${componentName} - Some Fancy Random Name**
    
    ### What is this
    
    (TODO: Write a brief description of the component.)
    
    ## Why is This?
    
    (TODO: Explain why this component exists or its purpose in your project.)
    
    ## How is this?
    
    (TODO: Describe how to use this component or any relevant information about its implementation.)
    
    #### A Word from the dev...
    
    (TODO: Any personal notes from the developer about this component.)
    
    Special thanks goes to me, zshmeta. All rights reserved.
      `;
    
      fs.writeFileSync(
        path.join(componentPath, `${componentName}.Readme.md`),
        componentReadmeTemplate,
        );
    };



// Create the component
createComponent(componentName, componentStyle, createTest, lazy, story, savePath);
