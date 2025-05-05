import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

const TextArea = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      multiline
      numberOfLines={4}
      ref={ref}
      textAlignVertical="top"
      className={cn(
        "web:w-full web:min-h-[6rem] native:min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-base lg:text-sm text-foreground placeholder:text-muted-foreground web:ring-offset-background focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
        props.editable === false && "opacity-50 web:cursor-not-allowed",
        className
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export { TextArea };
