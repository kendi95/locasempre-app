import { useState } from 'react'
import { X, Trash2 } from 'lucide-react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { 
  clamp, 
  useAnimatedStyle, 
  useSharedValue 
} from 'react-native-reanimated'
import { 
  Pressable, 
  Image, 
  PressableProps, 
  ImageSourcePropType, 
  Modal, 
  View, 
  useWindowDimensions,
  ViewStyle,
  ImageStyle,
  TextStyle,
  TouchableOpacity, 
} from 'react-native'

import { fonts } from '@/libs/uninstyles/tokens/fonts'

type ImageCardProps = PressableProps & {
  size?: keyof typeof fonts.size
  source: ImageSourcePropType
  style?: ViewStyle | ImageStyle | TextStyle
  onRemoveImage?: () => void
  showRemoveButton?: boolean
}

export function ImageCard({ size = 'base', source, onRemoveImage, showRemoveButton = false, ...rest }: ImageCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { width, height } = useWindowDimensions()

  const scale = useSharedValue(1)
  const startScale = useSharedValue(0)

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value
    })
    .onUpdate((event) => {
      scale.value = clamp(startScale.value * event.scale, 0.5, Math.min(width, height))
    })
    .runOnJS(true)

  const animatedScaleStyled = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value }
      ]
    }
  })

  const style = createStyleSheet((theme) => ({
    button: {
      width: theme.fonts.size[size] * 3,
      height: theme.fonts.size[size] * 3,
      borderRadius: theme.fonts.size[size] / 1.6,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.8,
      borderColor: theme.colors.shape,
      overflow: 'hidden',
      marginTop: 4
    },

    trashButtonContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.accent,
      padding: 8,
      borderTopLeftRadius: 14
    },

    modalContainer: {
      flex: 1,
      backgroundColor: `${theme.colors.background}99`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: 'auto',
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    closeButton: {
      padding: theme.fonts.size.base / 2,
      marginTop: theme.fonts.size.base * 4,
      marginRight: theme.fonts.size.base,
      alignSelf: 'flex-end',
    }
  }))

  const { theme, styles } = useStyles(style)

  function handleShowImage() {
    setShowModal(true)
  }

  function handleCloseImage() {
    setShowModal(false)
  }

  return (
    <>
      <Pressable {...rest} style={[styles.button, rest.style]} onPress={handleShowImage}>
        <Image 
          source={source} 
          width={theme.fonts.size[size] * 3} 
          height={theme.fonts.size[size] * 3} 
          resizeMode='cover'
          resizeMethod='auto'
        />

        {showRemoveButton && (
          <TouchableOpacity 
            activeOpacity={0.6} 
            style={styles.trashButtonContainer}
            onPress={onRemoveImage}
          >
            <Trash2 size={14} color={theme.colors.title} />
          </TouchableOpacity>
        )}
      </Pressable>

      <Modal 
        transparent
        visible={showModal} 
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable 
              android_ripple={{ borderless: false }} 
              style={styles.closeButton} 
              onPress={handleCloseImage}
            >
              <X size={24} color={theme.colors.title} />
            </Pressable>

            <GestureHandlerRootView>
              <GestureDetector gesture={pinch}>
                <Animated.Image
                  source={source} 
                  resizeMode='contain' 
                  style={[{ width, height }, animatedScaleStyled]}
                />
              </GestureDetector>

            </GestureHandlerRootView>
          </View>
        </View>
      </Modal>
    </>
    
  )
}