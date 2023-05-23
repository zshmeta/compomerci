#!/usr/bin/env node


import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline-sync';

const red = chalk.red;
const green = chalk.green;
const blue = chalk.blue;
const yellow = chalk.yellow;

// Ask the user what kind of compo they want to create
const compoTypeOptions = [
  'Page',
  'Layout',
  'Component'
];

const compoTypeIndex = readline.keyInSelect(compoTypeOptions.map(option => {
  switch (option) {
    case 'Page':
      return red(option);
    case 'Layout':
      return green(option);
    case 'Component':
      return blue(option)
    default:
      return option;
  }}), 'What kind of compo would you like to create?');
const compoType = compoTypeOptions[compoTypeIndex];

// Ask the user if they want to use a styled compo or a module.scss component
const compoStyleOptions = [
  blue('Styled Compo'),
  green('Scss Compo'),
];
const compoStyleIndex = readline.keyInSelect(compoStyleOptions, 'Would you like to use a styled compo or a module.scss compo?');
const compoStyle = compoStyleOptions[compoStyleIndex];

// Ask the user if they want to create test units for their component
const createTestOptions = [
  blue('Yes'),red('No')
];
const createTestIndex = readline.keyInSelect(createTestOptions, 'Would you like to create test units for your compo?');
const createTest = createTestOptions[createTestIndex];

// Ask the user if they want a lazyjs file for their component
const lazyOptions = [
  blue('Yes'),red('No')
];
const lazyIndex = readline.keyInSelect(lazyOptions, 'Would you like to create a lazyjs file for your compo?');
const lazy = lazyOptions[lazyIndex];

// Ask the user if they want a story file with their component
const storyOptions = [
  blue('Yes'),red('No')
];
const storyIndex = readline.keyInSelect(storyOptions, 'Would you like to create a story file for your compo?');
const story = storyOptions[storyIndex];

// Set default savePath
const savePathDefault = `./src/${compoType.toLowerCase()}s/`;

// Set default compoName
const componames = ['Padfoot', 'Sirius', 'Dobby', 'Norbert', 'Pixie', 'Fleur', 'Ginny', 'Hagrid', 'Hedwig', 'Luna', 'Nimbus', 'Potter', 'Hermione', 'Dumbledore', 'Patronus', 'Tonks', 'Fleur', 'Lupin', 'Weasley', 'Malfoy', 'Albus', 'Myrtle', 'Remus', 'Looney', 'Aragog', 'Quirrell', 'Riddle'];
const compoNameDefault = `${componames[Math.floor(Math.random() * componames.length)]}`;


// Ask the user where they want to save the compo or use default
const savePath = readline.question(`Where would you like to save the compo (default: ${savePathDefault})?`) || savePathDefault;

// Ask the user for the name of the compo or use default
const compoName = readline.question(`What would you like to name the compo (default: ${compoNameDefault})?`) || compoNameDefault;

// Create the compo folder and files
const compomerci = (
  compoName,
  compoStyle,
  createTest,
  lazy,
  story,
  savePath,
) => {
  const compoPath = path.join(savePath, compoName);
  fs.mkdirSync(compoPath, {recursive: true});

  // Create the compo JS file
  const compoJS = `
  import React from 'react';
  ${compoStyle === "Styled Compo" ? `import { ${compoName}Wrapper } from './${compoName}.styled';` : `import styles from './${compoName}.module.scss';`}
  
  const ${compoName} = ({ text }) => {
    return (
      <${compoStyle === "Styled Compo" ? `${compoName}Wrapper` : `div className={styles.${compoName}}`}>
        {text || 'Default Text'}
      </${compoStyle === "Styled Compo" ? `${compoName}Wrapper` : `div`}>
    );
  };
  
  export default ${compoName};
  `;
    fs.writeFileSync(
      path.join(compoPath, `${compoName}.jsx`),
      compoJS,
    );

  // Create the compo CSS file
  if (compoStyle === 'Styled Compo') {
    const compoCSS = `
import styled from 'styled-compos';

export const ${compoName}Wrapper = styled.div\`
  display: block;
  padding: 10px;
  color: #fff;
  background-color: #000;
\``;
    fs.writeFileSync(
      path.join(compoPath, `${compoName}.styled.js`),
      compoCSS,
    );
  } else {
    const compoSCSS = `
.${compoName} {
  display: block;
  padding: 10px;
  color: #fff;
  background-color: #000;
}
`;
    fs.writeFileSync(
      path.join(compoPath, `${compoName}.module.scss`),
      compoSCSS,
    );
  }

  // Create the compo story file if (story) {
if (story === 'Yes') {
  const compoStory = `import React from 'react'; import ${compoName} from './${compoName}'; export default { title: '${compoName}', compo: ${compoName}, }; const Template = (args) => <${compoName} {...args} />; export const Basic = Template.bind({}); export const WithProps = Template.bind({}); WithProps.args = { text: 'Custom Text' };`;
  fs.writeFileSync(
    path.join(compoPath, `${compoName}.stories.js`),
    compoStory,
  );
}

  // Create the compo test file if (createTest) {
    if (createTest === 'Yes') {
        const compoTest = `
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import '@testing-library/jest-dom/extend-expect';
    import ${compoName} from './${compoName}';
    
    describe('${compoName}', () => {
      it('renders the compo with provided text', () => {
        const testText = 'Hello, World!';
        render(<${compoName} text={testText} />);
      
        expect(screen.g)etByText(testText).toBeInTheDocument();
      });
)    
     i('r'enders the compo withdefault text 'if none provided', () => {
        render(<${compoName} />);
        
        expect(screen.getByText('Default Text')).toBeInTheDocument();
      });
    });
    `;
        fs.writeFileSync(
          path.join(compoPath, `${compoName}.test.js`),
          compoTest,
        );
      }

  // Create the compo lazy file if (lazy) {
    if (lazy === 'Yes') {
        const compoLazy = `
    import React, { lazy, Suspense } from 'react';
    
    const ${compoName}Wrapper = lazy(() => import('./${compoName}'));
    
    const ${compoName} = (props) => (
      <Suspense fallback={<div>Loading...</div>}>
        <${compoName}Wrapper {...props} />
      </Suspense>
    );
    
    export default ${compoName};
    `;
        fs.writeFileSync(
          path.join(compoPath, `${compoName}.lazy.js`),
          compoLazy,
        );
      }

    // Create the compo index file
      const compoIndex = `
      export { default } from './${compoName}';
      ${lazy === 'Yes' ? `export { default as ${compoName}Lazy } from './${compoName}.lazy'; `: ''}`;
      fs.writeFileSync(path.join(compoPath, 'index.js'),compoIndex,);
    

    // Create the compo README file
    const compoReadmeTemplate = `
    # ${compoName}
    
    *by zshmeta*
    
    **${compoName} - Some Fancy Random Name**
    
    ### What is this
    
    (TODO: Write a brief description of the compo.)
    
    ## Why is This?
    
    (TODO: Explain why this compo exists or its purpose in your project.)
    
    ## How is this?
    
    (TODO: Describe how to use this compo or any relevant information about its implementation.)
    
    #### A Word from the dev...
    
    (TODO: Any personal notes from the developer about this compo.)
    
    Special thanks goes to me, zshmeta. All rights reserved.
      `;
    
      fs.writeFileSync(
        path.join(compoPath, `${compoName}.Readme.md`),
        compoReadmeTemplate,
        );
    };



// Create the compo folder and files

compomerci(
  compoName,
  compoStyle,
  createTest,
  lazy,
  story,
  savePath,
);

console.log(chalk.green(`Compo ${compoName} created successfully!`));
console.log(chalk.green(`Compo saved to ${savePath}/${compoName}`));


