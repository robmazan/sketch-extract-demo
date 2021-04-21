import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, ButtonProps } from '../components';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    theme: { table: { disable: true } },
    as: { table: { disable: true } },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args}>Button</Button>;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
};
