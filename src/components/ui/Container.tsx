import type { ReactNode } from 'react';

type ContainerWidth = 'content' | 'bleed' | 'text';

type ContainerElement = 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main' | 'article';

export interface ContainerProps {
  children: ReactNode;
  /**
   * `content` (1280px) for ordinary page content, `bleed` (1440px) for elements
   * that run wider than the text column, `text` (768px) for article measures.
   */
  width?: ContainerWidth;
  as?: ContainerElement;
  className?: string;
}

const widthClass: Record<ContainerWidth, string> = {
  content: 'max-w-content',
  bleed: 'max-w-bleed',
  text: 'max-w-text',
};

/**
 * Horizontal frame for page content: one max width, one gutter, centred.
 *
 * Every page uses this rather than per-section padding, so the left edge of
 * text aligns down the whole page regardless of which sections are present.
 */
export function Container({ children, width = 'content', as = 'div', className }: ContainerProps) {
  const Element = as;

  return (
    <Element
      className={[widthClass[width], 'mx-auto w-full px-gutter', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Element>
  );
}
