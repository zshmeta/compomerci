#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline-sync';
import chalk from 'chalk';



const red = chalk.red;
const green = chalk.green;
const blue = chalk.blue;
const yellow = chalk.yellow;


const askQuestionWithOptions = (question, options) => {
  console.log(question);
  return readline.keyInSelect(options, '');
};

// Ask the user what kind of compo they want to create
const compoTypeOptions = ['Page', 'Layout', 'Component'];

const compoTypeIndex = askQuestionWithOptions(
  `What kind of Components would you like to create?`,
  compoTypeOptions.map((option) => {
    const colorMap = { Page: red, Layout: green, Component: blue };
    return colorMap[option](option);
  })
);
const compoType = compoTypeOptions[compoTypeIndex];



const compoStyleOptions = [
  blue('Styled Compo'),
  green('Scss Compo'),
];

const compoStyleIndex = askQuestionWithOptions(
  `Would you like to use a styled ${compoType} or a module.scss ${compoType}?`,
  compoStyleOptions
);
const compoStyle = compoStyleOptions[compoStyleIndex];


const lazyOptions = [
  blue('Yes'),red('No')
];
const lazyIndex = askQuestionWithOptions(
  `Would you like to create a lazyjs file for your ${compoType}?`,
  lazyOptions
);
const lazy = lazyOptions[lazyIndex];



const storyOptions = [
  blue('Yes'),red('No')
];
const storyIndex = askQuestionWithOptions(
  `Would you like to create a story file for your ${compoType}?`,
  storyOptions
);
const story = storyOptions[storyIndex];



const createTestOptions = [
  blue('Yes'),red('No')
];
const createTestIndex = askQuestionWithOptions(
  `Would you like to create test units for your ${compoType}?`,
  createTestOptions
);
const createTest = createTestOptions[createTestIndex];

// Set default savePath
const savePathDefault = `./src/${compoType.toLowerCase()}s/`;

// Set default compoName
const componames = ['Azur','Indigo','Cyan','Teal','Lime','Amber','Purple','DeepPurple','Blue','LightBlue','DeepOrange','BlueGrey','Emerald','Topaze','Ruby','Saphir','Onyx','Opale','Perle','Diamant','Rubis','Saphir','Emeraude','Jade','Agate','Quartz','Granit','Marbre','Obsidienne','Lapis-lazuli','Malachite','Turquoise','Aigue-marine','Cristal','Ambre','Or','Argent','Bronze','Cuivre','Platine','Titane','Fer','Acier','Chrome','Nickel'];
const compoNameDefault = `${componames[Math.floor(Math.random() * componames.length)]}${compoType}`;


// Ask the user where they want to save the compo or use default
const savePath = readline.question(`Where would you like to save the ${compoType} (default: ${savePathDefault})?`) || savePathDefault;

// Ask the user for the name of the compo or use default
const compoName = readline.question(`What would you like to name the ${compoType} (default: ${compoNameDefault})?`) || compoNameDefault;

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
  ${compoStyle === blue('Styled Compo') ? `import { ${compoName}Wrapper } from './${compoName}.styled';` : `import styles from './${compoName}.module.scss';`}
  
  const ${compoName} = ({ text }) => {
    return (
      <${compoStyle === blue('Styled Compo') ? `${compoName}Wrapper` : `div className={styles.${compoName}}`}>
        {text || 'Default Text'}
      </${compoStyle === blue('Styled Compo') ? `${compoName}Wrapper` : `div`}>
    );
  };
  
  export default ${compoName};
  `;
    fs.writeFileSync(
      path.join(compoPath, `${compoName}.jsx`),
      compoJS,
    );

  // Create the compo CSS file
  if (compoStyle === blue('Styled Compo')) {
    const compoCSS = `
import styled from 'styled-components';

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
if (story === blue('Yes')) {
  const compoStory = `
  import React from 'react'; 
  import ${compoName} from './${compoName}'; 
  export default { title: '${compoName}', compo: ${compoName}, }; 
  const Template = (args) => <${compoName} {...args} />; 
  export const Basic = Template.bind({}); 
  export const WithProps = Template.bind({}); 
  WithProps.args = { text: 'Custom Text' };`;
  fs.writeFileSync(
    path.join(compoPath, `${compoName}.stories.js`),
    compoStory,
  );
}

  // Create the compo test file if (createTest) {
    if (createTest === blue('Yes')) {
        const compoTest = `
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import '@testing-library/jest-dom/extend-expect';
    import ${compoName} from './${compoName}';
    
    describe('${compoName}', () => {
      it('renders the compo with provided text', () => {
        const testText = 'Hello, World!';
        render(<${compoName} text={testText} />);
      
        expect(screen.getByText(testText)).toBeInTheDocument();
      });
      it('renders the compo with default text if none provided', () => {
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
    if (lazy === blue('Yes')) {
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
    
    **${compoName}.README - A Quick Overview**
    
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


    console.log(chalk.bgGreenBright('All done!'));
    console.log(chalk.yellow(`${compoType} ${compoName} created successfully!`));
    console.log(chalk.blue(`${compoType} saved to ${savePath}${compoName}`));
    console.log(chalk.redBright('Happy'), chalk.greenBright('Hacking!'));