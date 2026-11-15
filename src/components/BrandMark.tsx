/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

export interface BrandMarkProps {
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Whether to show the book with checkmark arrow logo (default: true) */
  showIcon?: boolean;
  /** Whether to show only the square book icon (used when sidebar is collapsed) */
  iconOnly?: boolean;
  /** Position of the book + arrow logo relative to the practCA wordmark (default: 'left') */
  iconPosition?: 'left' | 'top';
  /** Whether to play the sequential p-r-a-c-t -> CA -> book -> arrow animation */
  animated?: boolean;
  /** Whether to show the subtitle (Plan. Revise. Analyse. Correct. Track.) */
  showTagline?: boolean;
  /** Layout alignment */
  align?: 'left' | 'center';
  /** Optional click handler (e.g. navigation to home) */
  onClick?: () => void;
  /** Custom additional CSS classes on the outer container */
  className?: string;
  /** Custom additional CSS classes on the SVG element (e.g. for native vector height transitions) */
  svgClassName?: string;
}

/**
 * Exact 1:1 extracted vector Brand Mark of `practCA Logo.png` & `practCA Logo photo.png`
 * with transparent background and crisp geometricPrecision vector rendering.
 */
export default function BrandMark({
  size = 'md',
  showIcon = true,
  iconOnly = false,
  iconPosition = 'left',
  animated = false,
  showTagline = false,
  align = 'left',
  onClick,
  className = '',
  svgClassName = ''
}: BrandMarkProps) {
  const uid = useId().replace(/:/g, '');
  const goldGradId = `practca-gold-${uid}`;
  const topGoldGradId = `practca-top-gold-${uid}`;

  // Height presets preserving the exact aspect ratio of the extracted brand mark
  const sizeHeights: Record<NonNullable<BrandMarkProps['size']>, string> = {
    xs: iconOnly ? 'h-6 w-6' : 'h-6',
    sm: iconOnly ? 'h-8 w-8' : 'h-8 sm:h-9',
    md: iconOnly ? 'h-10 w-10' : 'h-10 sm:h-11',
    lg: iconOnly ? 'h-12 w-12' : 'h-12 sm:h-14',
    xl: iconOnly ? 'h-16 w-16' : 'h-14 sm:h-16 lg:h-20',
    '2xl': iconOnly ? 'h-24 w-24' : 'h-20 sm:h-28 md:h-36 lg:h-44'
  };

  const topIconHeights: Record<NonNullable<BrandMarkProps['size']>, string> = {
    xs: 'h-8 w-8',
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20 sm:h-24 sm:w-24',
    xl: 'h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32',
    '2xl': 'h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44'
  };

  const heightClass = svgClassName || sizeHeights[size] || sizeHeights.md;
  const topIconHeightClass = topIconHeights[size] || topIconHeights.md;
  const isCentered = align === 'center' || iconPosition === 'top';
  const showInlineIcon = showIcon && iconPosition === 'left';
  const showTopIcon = showIcon && iconPosition === 'top';
  const svgHeight = showTagline ? 288 : 236;

  if (iconOnly) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-transparent select-none transition-transform duration-200 ${
          onClick ? 'cursor-pointer hover:scale-105' : ''
        } ${className}`}
      >
        <svg
          viewBox="160 70 790 790"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          className={`${heightClass} w-auto overflow-visible`}
          aria-label="practACE Logo"
        >
          <defs>
            <linearGradient id={goldGradId} x1="180" y1="120" x2="880" y2="820" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EAC15A" />
              <stop offset="45%" stopColor="#DDA93E" />
              <stop offset="100%" stopColor="#C28B28" />
            </linearGradient>
          </defs>

          <g>
            {/* 1. Outer Book Frame (Left vertical bar + Bottom double-arc spine + Right vertical bar) */}
            <path
              className={animated ? 'practca-anim-book' : undefined}
              d="M 198 332 L 234 344 L 234 706 C 315 690 420 712 494 795 C 568 712 673 690 754 706 L 754 448 L 790 410 L 790 748 C 678 728 566 750 494 834 C 422 750 310 728 198 748 Z"
              fill={`url(#${goldGradId})`}
            />

            {/* 2. Inner Left Page (Curved top arch + Left vertical bar + Bottom arch tapering to spine) */}
            <path
              className={animated ? 'practca-anim-book' : undefined}
              d="M 260 294 C 355 308 440 355 498 442 C 435 382 358 354 296 344 L 296 642 C 365 650 438 696 494 792 C 428 720 345 678 260 672 Z"
              fill={`url(#${goldGradId})`}
            />

            {/* 3. Checkmark + Ascending Arrow */}
            <path
              className={animated ? 'practca-anim-arrow' : undefined}
              d="M 391 472 L 475 556 L 786 206 L 742 165 L 928 98 L 895 298 L 836 250 L 473 660 L 342 521 Z"
              fill={`url(#${goldGradId})`}
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex ${
        showTopIcon ? 'flex-col items-center gap-4 sm:gap-6' : `items-center ${isCentered ? 'justify-center' : 'justify-start'}`
      } bg-transparent select-none transition-all ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Top-Positioned Book + Checkmark Arrow Logo (when iconPosition === 'top') */}
      {showTopIcon && (
        <svg
          viewBox="160 70 790 790"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          className={`${topIconHeightClass} w-auto overflow-visible`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={topGoldGradId} x1="180" y1="120" x2="880" y2="820" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EAC15A" />
              <stop offset="45%" stopColor="#DDA93E" />
              <stop offset="100%" stopColor="#C28B28" />
            </linearGradient>
          </defs>

          <g>
            {/* Book Pages Group (animates in at step 3 when animated=true) */}
            <g className={animated ? 'practca-anim-book' : undefined}>
              <path
                d="M 198 332 L 234 344 L 234 706 C 315 690 420 712 494 795 C 568 712 673 690 754 706 L 754 448 L 790 410 L 790 748 C 678 728 566 750 494 834 C 422 750 310 728 198 748 Z"
                fill={`url(#${topGoldGradId})`}
              />
              <path
                d="M 260 294 C 355 308 440 355 498 442 C 435 382 358 354 296 344 L 296 642 C 365 650 438 696 494 792 C 428 720 345 678 260 672 Z"
                fill={`url(#${topGoldGradId})`}
              />
            </g>

            {/* Checkmark + Ascending Arrow (animates in at step 4 when animated=true) */}
            <path
              className={animated ? 'practca-anim-arrow' : undefined}
              d="M 391 472 L 475 556 L 786 206 L 742 165 L 928 98 L 895 298 L 836 250 L 473 660 L 342 521 Z"
              fill={`url(#${topGoldGradId})`}
            />
          </g>
        </svg>
      )}

      <svg
        viewBox={showInlineIcon ? `0 0 1160 ${svgHeight}` : `240 0 920 ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        className={`${heightClass} w-auto overflow-visible`}
        aria-label="practACE"
      >
        <defs>
          <linearGradient id={goldGradId} x1="0" y1="20" x2="1152" y2="215" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EAC15A" />
            <stop offset="50%" stopColor="#DCA83E" />
            <stop offset="100%" stopColor="#C38C29" />
          </linearGradient>
        </defs>

        {/* =====================================================================
            PART 1: EXACT EXTRACTED BOOK + CHECKMARK ARROW ICON
            Scaled and positioned directly from the original 1000x1000 icon
           ===================================================================== */}
        {showInlineIcon && (
          <g transform="translate(-32, -3) scale(0.268)">
            {/* Book Pages Group (animates in at step 3 when animated=true) */}
            <g className={animated ? 'practca-anim-book' : undefined}>
              {/* Outer Book Frame */}
              <path
                d="M 198 332 L 234 344 L 234 706 C 315 690 420 712 494 795 C 568 712 673 690 754 706 L 754 448 L 790 410 L 790 748 C 678 728 566 750 494 834 C 422 750 310 728 198 748 Z"
                fill={`url(#${goldGradId})`}
              />

              {/* Inner Left Page */}
              <path
                d="M 260 294 C 355 308 440 355 498 442 C 435 382 358 354 296 344 L 296 642 C 365 650 438 696 494 792 C 428 720 345 678 260 672 Z"
                fill={`url(#${goldGradId})`}
              />
            </g>

            {/* Checkmark + Ascending Arrow (animates in at step 4 when animated=true) */}
            <path
              className={animated ? 'practca-anim-arrow' : undefined}
              d="M 391 472 L 475 556 L 786 206 L 742 165 L 928 98 L 895 298 L 836 250 L 473 660 L 342 521 Z"
              fill={`url(#${goldGradId})`}
            />
          </g>
        )}

        {/* =====================================================================
            PART 2: EXACT EXTRACTED "pract" WORDMARK (PURE WHITE #FFFFFF)
            All letters converted to exact geometric outlines matching practCA Logo.png
           ===================================================================== */}
        <g fill="#FFFFFF">
          {/* Letter 'p' (with descender) */}
          <path
            className={animated ? 'practca-anim-item practca-anim-p' : undefined}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 252 83 H 281 V 96 C 289 85 302 80 318 80 C 349 80 372 103 372 135 C 372 167 349 190 318 190 C 302 190 289 185 281 174 V 224 H 252 V 83 Z M 312 105 C 295 105 282 117 282 135 C 282 153 295 165 312 165 C 329 165 342 153 342 135 C 342 117 329 105 312 105 Z"
          />

          {/* Letter 'r' */}
          <path
            className={animated ? 'practca-anim-item practca-anim-r' : undefined}
            d="M 388 83 H 417 V 99 C 424 86 436 80 452 80 V 108 C 450 108 447 108 444 108 C 427 108 418 117 418 136 V 187 H 388 V 83 Z"
          />

          {/* Letter 'a' (double-story geometric 'a') */}
          <path
            className={animated ? 'practca-anim-item practca-anim-a' : undefined}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 508 80 C 540 80 558 96 558 126 V 187 H 530 V 174 C 522 185 509 190 493 190 C 470 190 455 177 455 158 C 455 138 471 126 501 126 H 528 V 123 C 528 110 519 102 504 102 C 492 102 481 106 473 112 L 461 92 C 473 84 490 80 508 80 Z M 500 169 C 515 169 526 161 528 149 V 144 H 504 C 489 144 483 149 483 157 C 483 164 490 169 500 169 Z"
          />

          {/* Letter 'c' */}
          <path
            className={animated ? 'practca-anim-item practca-anim-c' : undefined}
            d="M 630 80 C 652 80 669 89 678 105 L 653 119 C 648 110 639 105 629 105 C 612 105 599 117 599 135 C 599 153 612 165 629 165 C 639 165 648 160 653 151 L 678 165 C 669 181 652 190 630 190 C 595 190 569 167 569 135 C 569 103 595 80 630 80 Z"
          />

          {/* Letter 't' with integrated upward-right curving stem & solid triangular arrowhead */}
          <path
            className={animated ? 'practca-anim-item practca-anim-t' : undefined}
            d="M 738 18 L 749 62 L 736 56 C 732 65 730 74 730 83 H 753 V 107 H 730 V 152 C 730 161 735 165 744 165 C 748 165 752 164 755 163 L 759 186 C 752 189 744 190 735 190 C 712 190 700 178 700 154 V 107 H 683 V 83 H 700 C 700 69 704 56 710 44 L 696 38 L 738 18 Z"
          />
        </g>

        {/* =====================================================================
            PART 3: EXACT GEOMETRIC "ACE" WORDMARK (GOLD GRADIENT)
            Bold geometric uppercase A, C, and E forming practACE
            When animated=true: C appears first, then C & A flip positions, then E appears to form ACE
           ===================================================================== */}
        <g fill={`url(#${goldGradId})`}>
          {/* Uppercase 'A' */}
          <path
            className={animated ? 'practca-anim-ace-a' : undefined}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 816 49 H 847 L 895 187 H 861 L 851 157 H 811 L 801 187 H 768 L 816 49 Z M 843 132 L 831 91 L 819 132 H 843 Z"
          />

          {/* Uppercase 'C' */}
          <path
            className={animated ? 'practca-anim-ace-c' : undefined}
            d="M 977 47 C 1005 47 1027 58 1039 77 L 1012 93 C 1004 80 992 74 977 74 C 953 74 936 92 936 118 C 936 144 953 162 977 162 C 992 162 1004 156 1012 143 L 1039 159 C 1027 178 1005 189 977 189 C 935 189 904 159 904 118 C 904 77 935 47 977 47 Z"
          />

          {/* Uppercase 'E' */}
          <path
            className={animated ? 'practca-anim-ace-e' : undefined}
            d="M 1054 49 H 1150 V 76 H 1085 V 104 H 1140 V 131 H 1085 V 160 H 1152 V 187 H 1054 V 49 Z"
          />
        </g>

        {/* =====================================================================
            PART 4: SUBTITLE ("Plan. Revise. Analyse. Correct. Track.") -> LINE -> DOT-SEPARATED SUBTITLE BELOW LINE
           ===================================================================== */}
        {showTagline && (
          <g>
            {animated && (
              <g
                className="practca-sub-words-group"
                fill={`url(#${goldGradId})`}
                fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
                fontSize="27"
                fontWeight="500"
                letterSpacing="0.04em"
                textAnchor="middle"
              >
                <text
                  x="172"
                  y="248"
                  className="practca-sub-word practca-sub-p"
                >
                  Plan.
                </text>
                <text
                  x="375"
                  y="248"
                  className="practca-sub-word practca-sub-r"
                >
                  Revise.
                </text>
                <text
                  x="578"
                  y="248"
                  className="practca-sub-word practca-sub-a"
                >
                  Analyse.
                </text>
                <text
                  x="781"
                  y="248"
                  className="practca-sub-word practca-sub-c"
                >
                  Correct.
                </text>
                <text
                  x="984"
                  y="248"
                  className="practca-sub-word practca-sub-t"
                >
                  Track.
                </text>
              </g>
            )}

            <rect
              x="252"
              y="232"
              width="900"
              height="3.5"
              rx="1.75"
              fill={`url(#${goldGradId})`}
              className={animated ? 'practca-sub-line' : undefined}
            />

            <text
              x="702"
              y="270"
              fill={`url(#${goldGradId})`}
              fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
              fontSize="25"
              fontWeight="500"
              letterSpacing="0.055em"
              textAnchor="middle"
              xmlSpace="preserve"
              className={animated ? 'practca-sub-below-line' : undefined}
            >
              {'Plan  \u2022  Revise  \u2022  Analyse  \u2022  Correct  \u2022  Track'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
