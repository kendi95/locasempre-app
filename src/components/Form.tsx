import { View, ViewProps, KeyboardAvoidingView, KeyboardAvoidingViewProps } from "react-native";

type FormProps = KeyboardAvoidingViewProps & {
  children: React.ReactNode
}

export function Form({ children, ...rest }: FormProps) {
  return (
    <KeyboardAvoidingView {...rest} style={[{ width: '100%', gap: 6 }, rest.style]}>
      {children}
    </KeyboardAvoidingView>
  )
}