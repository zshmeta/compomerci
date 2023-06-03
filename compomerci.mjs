#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline-sync';
import chalk from 'chalk';
import inquirer from 'inquirer';



const red = chalk.red;
const green = chalk.green;
const blue = chalk.blue;
const yellow = chalk.yellow;
const cyan = chalk.cyan;


const askQuestionWithOptions = async (message, choices, allowCancel = true) => {
  if (allowCancel) {
    choices.push(red('Cancel'));
  }
  const { answer } = await inquirer.prompt([
    {
      type: 'list',
      name: 'answer',
      message,
      choices,
    },
  ]);

  return choices.indexOf(answer);
};

// Questions to ask the user
const compoTypeOptions = ['Component', 'Layout', 'Page'];

const elementOptions = [
  'None',
  blue('Button'),
  yellow('Media'),
  green('Text'),
  cyan('Container'),
];

const compoStyleOptions = [blue('Styled Compo'), green('Scss Compo')];

const typeOptions = [yellow('No'), blue('Yes')];

const lazyOptions = [blue('Yes'), yellow('No')];

const storyOptions = [blue('Yes'), yellow('No')];

const createTestOptions = [blue('Yes'), yellow('No')];

// Main function to execute the script
const main = async () => {
  let createAnotherComponent = true;
  while (createAnotherComponent) {
  // Ask questions and store the answers
  const compoTypeIndex = await askQuestionWithOptions(
    `What kind of Components would you like to create?`,
    compoTypeOptions.map((option) => {
      const colorMap = { Component: yellow, Layout: green, Page: blue };
      return colorMap[option](option);
    })
  );

  const compoType = compoTypeOptions[compoTypeIndex];

  const typeIndex = await askQuestionWithOptions(
    `Would you like to include types for your ${compoType}? (Default: None)`,
    typeOptions
  );

  const isTypeScript = typeOptions[typeIndex] === blue('Yes');

  if (compoType === 'Page') {
    compoStyleOptions.push(yellow('No Style'));
  }

  const compoStyleIndex = await askQuestionWithOptions(
    `Would you like to use a styled ${compoType} or a module.scss ${compoType}?`,
    compoStyleOptions
  );
  const compoStyle = compoStyleOptions[compoStyleIndex];

  const elementIndex = await askQuestionWithOptions(
    `Would you like to add an element to your ${compoType}?`,
    elementOptions
  );

  const elementType = elementOptions[elementIndex];

  let customElementName = '';

  if (elementType === 'Custom') {
    const { customName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customName',
        message: `Please enter the name of the custom element:`,
      },
    ]);
    customElementName = customName;
  }

  const lazyIndex = await askQuestionWithOptions(
    `Would you like to create a lazyjs file for your ${compoType}?`,
    lazyOptions
  );
  const lazy = lazyOptions[lazyIndex];

  const storyIndex = await askQuestionWithOptions(
    `Would you like to create a story file for your ${compoType}?`,
    storyOptions
  );
  const story = storyOptions[storyIndex];

  const createTestIndex = await askQuestionWithOptions(
    `Would you like to create test units for your ${compoType}?`,
    createTestOptions
  );
  const createTest = createTestOptions[createTestIndex];

  // Set default savePath
  const savePathDefault = `./src/${compoType.toLowerCase()}s/`;

  // Set default compoName
  const componames = [
    'Azur',
    'Indigo',
    'Cyan',
    'Teal',
    'Lime',
    'Amber',
    'Purple',
    'DeepPurple',
    'Blue',
    'LightBlue',
    'DeepOrange',
    'BlueGrey',
    'Emerald',
    'Topaze',
    'Ruby',
    'Saphir',
    'Onyx',
    'Opale',
    'Perle',
    'Diamant',
    'Rubis',
    'Saphir',
    'Emeraude',
    'Jade',
    'Agate',
    'Quartz',
    'Granit',
    'Marbre',
    'Obsidienne',
    'Lapis-lazuli',
    'Malachite',
    'Turquoise',
    'Aigue-marine',
    'Cristal',
    'Ambre',
    'Or',
    'Argent',
    'Bronze',
    'Cuivre',
    'Platine',
    'Titane',
    'Fer',
    'Acier',
    'Chrome',
    'Nickel',
  ];
  const compoNameDefault = `${
    componames[Math.floor(Math.random() * componames.length)]
  }${compoType}`;

  // Ask the user for the savePath and compoName
  const { savePath, compoName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'savePath',
      message: `Where would you like to save the ${compoType} (default: ${savePathDefault})?`,
      default: savePathDefault,
    },
    {
      type: 'input',
      name: 'compoName',
      message: `What would you like to name the ${compoType} (default: ${compoNameDefault})?`,
      default: compoNameDefault,
    },
  ]);

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
  import React, { useState } from 'react';
  ${compoStyle === blue('Styled Compo') ? `import { ${compoName}Wrapper } from './${compoName}.styled';` : `import styles from './${compoName}.module.scss';`}
  
  ${isTypeScript ? `type ${compoName}Props = {
    ${elementType !== 'None' ? `${elementType.toLowerCase()}?: ${elementType === 'Custom' ? customElementName : 'React.ReactNode'};` : ''}
  };` : ''}
  
  const ${compoName}${isTypeScript ? `: React.FC<${compoName}Props>` : ''} = ({ ${elementType !== 'None' ? `${elementType.toLowerCase()},` : ''} ...props }) => {
    const [count, setCount] = useState(0);
  
    const handleClick = () => {
      // Handle click events or other interactions here
      setCount(count + 1);
    };
  
    return (
      <${compoStyle === blue('Styled Compo') ? `${compoName}Wrapper` : `div`} className={styles.${compoName}} {...props}>
        ${elementType === 'Button' ? `<button onClick={handleClick}>{${elementType.toLowerCase()} || 'Default Button'}</button>` : ''}
        ${elementType === 'Text' ? `<div>{${elementType.toLowerCase()} || 'Hello World'}</div>` : ''}
        ${elementType === 'Media' ? `<img src={${elementType.toLowerCase()} || 'default-image.png'} alt="media" />` : ''}
        ${elementType === 'Container' ? `<div className={styles.container}>{${elementType.toLowerCase()} || 'Default Container'}</div>` : ''}
        ${elementType === 'Custom' ? `<${customElementName} {...${elementType.toLowerCase()}} />` : ''}
        ${elementType === 'Button' ? `<div>Counter: {count}</div>` : ''}
      </${compoStyle === blue('Styled Compo') ? `${compoName}Wrapper` : `div`}>
    );
  };
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
      path.join(compoPath, `${compoName}.scoped.scss`),
      compoSCSS,
    );
  }




  // Create the compo story file if (story) {
if (story === blue('Yes')) {
  const compoStory = `
  import React from 'react'; 
  import ${compoName} from './${compoName}'; 
  // components/atoms/${compoName}/index.stories.js
  import React from 'react';
  import { action } from '@storybook/addon-actions';
  import { storiesOf } from '@storybook/react';
  import { ${compoName} } from '../..';

  storiesOf('atoms/${compoName}', module)
    .add('default', () => (
      <${compoName} onClick={action('clicked')}>
      Default
    </${compoName}>
  ))
  .add('outlined primary', () => (
      <${compoName} variant="outlined" color="primary" onClick={action('clicked')}>
      Outline Primary
    </${compoName}>
  ))
  .add('contained secondary', () => (
      <${compoName} variant="contained" color="secondary" onClick={action('clicked')}>
      Contained Secondary
    </${compoName}>
  ))
  .add('circle ${compoName}', () => (
      <${compoName} variant="fab" color="primary" aria-label="Add" onClick={action('clicked')}>
      CB
    </${compoName}>
  ))
  .add('disabled ${compoName}', () => (
      <${compoName} variant="contained" color="primary" onClick={action('clicked')} disabled>
      Disabled ${compoName}
    </${compoName}>
  ));
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
import { render, fireEvent, screen } from '@testing-library/react';
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

  test('renders without crashing', () => {
    render(<${compoName} />);
  });

  test('renders with initial props', () => {
    const initialProps = {
      // Add your initial props here
    };

    render(<${compoName} {...initialProps} />);

    // Add assertions to check if the component renders correctly with the initial props
  });

  test('interactions work as expected', () => {
    render(<${compoName} />);

    // Add fireEvent calls and assertions to test interactions
  });

  test('renders with different props', () => {
    const newProps = {
      // Add your new props here
    };

    render(<${compoName} {...newProps} />);

    // Add assertions to check if the component renders correctly with the new props
  });

  test('snapshot testing', () => {
    const { asFragment } = render(<${compoName} />);
    expect(asFragment()).toMatchSnapshot();
  });

  // Add more tests for other scenarios and edge cases
});`;
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


    console.log(chalk.yellow(`${compoType} ${compoName} created successfully!`));
    console.log(chalk.blue(`${compoType} saved to ${savePath}${compoName}`));
   // Ask the user if they want to create another component
   const { continueCreating } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continueCreating',
      message: 'Do you want to create another component?',
    },
  ]);

  createAnotherComponent = continueCreating;
  if (!createAnotherComponent) {
    console.log(chalk.bgYellowBright('All done!'));
    console.log(chalk.bgRedBright('Happy'), chalk.bgGreenBright('Hacking!'));

    break;
  }
}
};

// Execute the main function
main();