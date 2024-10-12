declare module 'react-modal' {
  import * as React from 'react';

  export interface ModalProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    onRequestClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    closeTimeoutMS?: number;
    style?: {
      content?: React.CSSProperties;
      overlay?: React.CSSProperties;
    };
    contentLabel?: string;
    portalClassName?: string;
    overlayClassName?: string | object;
    id?: string;
    className?: string | object;
    bodyOpenClassName?: string;
    htmlOpenClassName?: string;
    ariaHideApp?: boolean;
    shouldFocusAfterRender?: boolean;
    shouldCloseOnOverlayClick?: boolean;
    shouldReturnFocusAfterClose?: boolean;
    role?: string;
    parentSelector?: () => HTMLElement;
    aria?: {
      [key: string]: string;
    };
    data?: {
      [key: string]: any;
    };
    overlayRef?: (node: HTMLElement | null) => void;
    contentRef?: (node: HTMLElement | null) => void;
    shouldCloseOnEsc?: boolean;
  }

  export default class Modal extends React.Component<ModalProps> {}
}