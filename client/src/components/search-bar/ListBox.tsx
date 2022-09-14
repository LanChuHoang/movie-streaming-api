import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

interface ListBoxProps extends React.HTMLAttributes<HTMLUListElement> {}

const ListBox = forwardRef(function ListBoxBase(
  props: ListBoxProps,
  ref: ForwardedRef<HTMLUListElement>
) {
  const { children, ...rest } = props;

  const innerRef = useRef<HTMLUListElement>(null);

  useImperativeHandle<NullableUlElement, NullableUlElement>(
    ref,
    () => innerRef.current
  );

  return (
    <ul {...rest} ref={innerRef} role="list-box">
      {children}
    </ul>
  );
});

export default ListBox;

type NullableUlElement = HTMLUListElement | null;
