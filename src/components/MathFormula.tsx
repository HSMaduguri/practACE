import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * Cleanly converts HTML sub/sup, fractions, or standard mathematical formulas to valid KaTeX LaTeX syntax.
 */
export function parseToLatex(input: string): string {
  if (!input) return '';

  let str = input.trim();

  // If already KaTeX format or plain text, convert sub/sup html
  str = str
    .replace(/<sub>(.*?)<\/sub>/gi, '_{$1}')
    .replace(/<sup>(.*?)<\/sup>/gi, '^{$1}')
    .replace(/&times;/gi, '\\times ')
    .replace(/&divide;/gi, '\\div ')
    .replace(/&plusmn;/gi, '\\pm ')
    .replace(/&sigma;/gi, '\\sigma ')
    .replace(/&rho;/gi, '\\rho ')
    .replace(/&beta;/gi, '\\beta ')
    .replace(/&alpha;/gi, '\\alpha ')
    .replace(/&Delta;/gi, '\\Delta ')
    .replace(/&theta;/gi, '\\theta ')
    .replace(/&ge;/gi, '\\ge ')
    .replace(/&le;/gi, '\\le ')
    .replace(/&ne;/gi, '\\ne ');

  // If raw fractions or HTML tags exist, strip HTML safely
  str = str.replace(/<[^>]+>/g, '');

  return str;
}

export function MathFormula({ math, block = false, className = '' }: MathFormulaProps) {
  if (!math) return null;
  const latex = parseToLatex(math);

  try {
    if (block) {
      return (
        <div className={`katex-block-wrapper text-white inline-block max-w-full overflow-x-auto ${className}`}>
          <BlockMath math={latex} />
        </div>
      );
    }
    return (
      <span className={`katex-inline-wrapper text-white inline-block ${className}`}>
        <InlineMath math={latex} />
      </span>
    );
  } catch (err) {
    return (
      <span className={`text-white ${className}`} dangerouslySetInnerHTML={{ __html: math }} />
    );
  }
}

export default MathFormula;
