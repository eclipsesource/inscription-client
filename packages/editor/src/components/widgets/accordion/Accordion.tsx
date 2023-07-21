import './Accordion.css';
import { Content, Header, Item, Root, Trigger } from '@radix-ui/react-accordion';
import IvyIcon from '../IvyIcon';
import { IvyIcons } from '@axonivy/editor-icons';
import Button from '../button/Button';
import { ComponentProps, ReactNode } from 'react';

type AccordionRootProps = {
  value: string;
  onChange: (change: string) => void;
  children: ReactNode;
};

export const AccordionRoot = ({ value, onChange, children }: AccordionRootProps) => {
  return (
    <Root type='single' className='accordion-root' collapsible={true} value={value} onValueChange={onChange}>
      {children}
    </Root>
  );
};

type AccordionItemProps = {
  value: string;
  children: ReactNode;
};

export const AccordionItem = ({ value, children }: AccordionItemProps) => {
  return (
    <Item value={value} className='accordion-item'>
      {children}
    </Item>
  );
};

type AccordionHeaderProps = {
  title?: string;
  control?: { label: string; icon: IvyIcons; action: () => void };
  children: ReactNode;
};

export const AccordionHeader = ({ title, control, children, ...props }: AccordionHeaderProps) => {
  return (
    <Header className='accordion-header' title={title}>
      <Trigger className='accordion-trigger'>{children}</Trigger>
      <div className='accordion-header-group'>
        {control && <Button icon={control.icon} onClick={control.action} aria-label={control.label} />}
        <IvyIcon icon={IvyIcons.AngleDown} />
      </div>
    </Header>
  );
};

export const AccordionContent = ({ children, className, ...props }: { children: ReactNode } & ComponentProps<'div'>) => {
  return (
    <Content className='accordion-content'>
      <div {...props} className={`accordion-content-data ${className ?? ''}`}>
        {children}
      </div>
    </Content>
  );
};
