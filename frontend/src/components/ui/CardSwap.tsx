import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card card-swap-card ${customClass ?? ''} ${className ?? ''}`.trim()}
    />
  )
);
Card.displayName = 'Card';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  dropDistance?: number;
  swapDistance?: number;
  swapDirection?: 'horizontal' | 'vertical';
  delay?: number;
  pauseOnHover?: boolean;
  reducedMotion?: boolean;
  onCardClick?: (idx: number) => void;
  onCardChange?: (frontIndex: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
  className?: string;
}

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * 10,
  scale: 1 - i * 0.015,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement | null, slot: ReturnType<typeof makeSlot>, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    scale: slot.scale,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 0,
  verticalDistance = 14,
  dropDistance = 300,
  swapDistance = 320,
  swapDirection = 'horizontal',
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onCardChange,
  skewAmount = 0,
  easing = 'elastic',
  reducedMotion = false,
  children,
  className = '',
}) => {
  // Ultra-smooth, seamless timings with zero dead wait at apex
  const config = useMemo(() => {
    if (easing === 'linear') {
      return {
        easeOut: 'power1.out',
        easeReturn: 'power1.inOut',
        easePromote: 'power1.out',
        durOut: 0.42,
        durPromote: 0.44,
        durReturn: 0.46,
        promoteDelay: 0.08,
      };
    }
    return {
      easeOut: 'power2.out',
      easeReturn: 'power2.out',
      easePromote: 'power2.out',
      durOut: 0.46,
      durPromote: 0.48,
      durReturn: 0.50,
      promoteDelay: 0.1,
    };
  }, [easing]);

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    );

    if (reducedMotion) return;

    const swap = () => {
      if (order.current.length < 2) return;

      const front = order.current[0];
      const rest = order.current.slice(1);
      if (front === undefined || rest.length === 0) return;

      const frontRef = refs[front];
      if (!frontRef || !frontRef.current) return;
      const elFront = frontRef.current;

      const tl = gsap.timeline();
      tlRef.current = tl;

      const isHorizontal = swapDirection === 'horizontal';

      // 1. Move the front card out smoothly (sideways left-to-right)
      if (isHorizontal) {
        tl.to(
          elFront,
          {
            x: `+=${swapDistance}`,
            duration: config.durOut,
            ease: config.easeOut,
          },
          0
        );
      } else {
        tl.to(
          elFront,
          {
            y: `+=${dropDistance}`,
            duration: config.durOut,
            ease: config.easeOut,
          },
          0
        );
      }

      // 2. Concurrently promote the rest of the cards forward as the front card leaves
      rest.forEach((idx, i) => {
        const refItem = refs[idx];
        if (!refItem || !refItem.current) return;
        const el = refItem.current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, config.promoteDelay);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            scale: slot.scale,
            duration: config.durPromote,
            ease: config.easePromote,
          },
          config.promoteDelay + i * 0.04
        );
      });

      // 3. SEAMLESS RETURN: Exactly when the card reaches the apex,
      // drop zIndex behind the stack and glide back immediately with ZERO pause!
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      const returnTime = config.durOut;

      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        returnTime
      );

      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          scale: backSlot.scale,
          duration: config.durReturn,
          ease: config.easeReturn,
        },
        returnTime
      );

      tl.call(() => {
        order.current = [...rest, front];
        const nextFront = rest[0];
        if (nextFront !== undefined) {
          onCardChange?.(nextFront);
        }
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (node) {
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = window.setInterval(swap, delay);
        };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        return () => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
          clearInterval(intervalRef.current);
        };
      }
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, reducedMotion, swapDirection, swapDistance, dropDistance]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;
    const element = child as React.ReactElement<any>;
    return cloneElement(element, {
      key: i,
      ref: refs[i],
      style: { width, height, ...(element.props.style ?? {}) },
      onClick: (e: React.MouseEvent) => {
        element.props.onClick?.(e);
        onCardClick?.(i);
      },
    });
  });

  return (
    <div
      ref={container}
      className={`card-swap-container ${className}`.trim()}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
