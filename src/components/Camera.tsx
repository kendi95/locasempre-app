import { useEffect, useRef, useState } from "react"
import { Aperture, SwitchCamera, ChevronLeft, LightbulbOff, Lightbulb, Check, X } from 'lucide-react-native'
import { BackHandler, Dimensions, Image, Pressable, View } from "react-native"
import { Camera as CameraView, CameraType, FlashMode, ImageType, CameraCapturedPicture } from 'expo-camera'
import { createStyleSheet, useStyles } from "react-native-unistyles"
import Reanimated, { 
  interpolate, 
  useAnimatedStyle, 
  useDerivedValue, 
  useSharedValue, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated'

type CameraProps = {
  onBackCamera: () => void
  onTakePicture: (image: CameraCapturedPicture) => void
  isShow: boolean
}

const { width, height } = Dimensions.get('screen')

const AnimatedSwitchCamera = Reanimated.createAnimatedComponent(SwitchCamera)

export function Camera({ onBackCamera, isShow, onTakePicture }: CameraProps) {
  const cameraRef = useRef<CameraView>(null)
  const [type, setType] = useState<CameraType>(CameraType.back)
  const [flash, setFlash] = useState<FlashMode>(FlashMode.off)
  const [image, setImage] = useState<CameraCapturedPicture | undefined>(undefined)
  const [permission, requestPermission] = CameraView.useCameraPermissions()

  const rotate = useSharedValue(0)
  const opacity = useSharedValue(0)

  const rotateStyled = useDerivedValue(() => {
    return interpolate(
      rotate.value,
      [0, 90, 180],
      [0, 90, 180],
    )
  })

  const opacityStyled = useDerivedValue(() => {
    return interpolate(
      opacity.value,
      [0, 1],
      [0, 1],
    )
  })

  const animatedRotateStyled = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotateStyled.value}deg` }
      ]
    }
  })

  const animatedOpacityStyled = useAnimatedStyle(() => {
    return {
      opacity: opacityStyled.value
    }
  })

  const { styles, theme } = useStyles(style)

  function handleSwitchType() {
    setType(oldType => oldType === CameraType.back ? CameraType.front : CameraType.back)

    'worklet'
    rotate.value = withTiming(type === CameraType.back ? 180 : 0, { duration: 800 })
  }

  function handleToggleLight() {
    setFlash(oldFlash => oldFlash === FlashMode.off ? FlashMode.on : FlashMode.off)
  }

  async function handleTakePicture() {
    const picture = await cameraRef.current?.takePictureAsync({
      imageType: ImageType.jpg,
      quality: 0.5,
      base64: true
    })

    setImage(picture)
  }

  function handleRemoveImage() {
    setImage(undefined)
  }

  function handleDone() {
    if (image) onTakePicture(image)
    
    setImage(undefined)
    onBackCamera()
  }

  function handleBackCamera() {
    onBackCamera()

    'worklet'
    opacity.value = withTiming(0, { duration: 500 })
  }

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission().then(response => {
        // console.log(response.granted)
      })
    }
  }, [permission])

  useEffect(() => {
    opacity.value = withTiming(isShow ? 1 : 0, { duration: 500 })
  }, [isShow])

  useEffect(() => {
    const subscriber = BackHandler.addEventListener('hardwareBackPress', () => {
      return false
    })

    return () => subscriber.remove()
  }, [])

  if (image === undefined) {
    return (
      <Reanimated.View style={[styles.container, animatedOpacityStyled]}>
        <CameraView 
          ref={cameraRef}
          useCamera2Api 
          type={type} 
          zoom={0} 
          style={styles.cameraContainer} 
          ratio="16:9"
          flashMode={flash}
        >
          <Pressable 
            onPress={handleToggleLight}
            android_ripple={{ 
              borderless: false, 
              foreground: false, 
              color: `${theme.colors.shape}10` 
            }} 
            style={styles.flashButton}
          >
            {flash === FlashMode.off 
              ? (
                <LightbulbOff size={24} color={theme.colors.title} />
              ) 
              : (
                <Lightbulb size={24} color={theme.colors.primary} />
              )
            }
            
          </Pressable>
  
          <View style={styles.buttonContainer}>
            <Pressable 
              onPress={handleBackCamera}
              android_ripple={{ 
                borderless: false, 
                foreground: false, 
                color: `${theme.colors.shape}10` 
              }} 
              style={[
                styles.cameraButton, 
                { backgroundColor: theme.colors.shape }
              ]}
            >
              <ChevronLeft size={28} color={theme.colors.title} />
            </Pressable>
  
            <Pressable 
              onPress={handleTakePicture}
              android_ripple={{ 
                borderless: false, 
                foreground: false, 
                color: `${theme.colors.shape}10` 
              }} 
              style={styles.cameraButton}
            >
              <Aperture size={28} color={theme.colors.title} />
            </Pressable>
  
            <Pressable 
              onPress={runOnJS(handleSwitchType)}
              android_ripple={{ 
                borderless: false, 
                foreground: false, 
                color: `${theme.colors.shape}10` 
              }} 
              style={[
                styles.cameraButton, 
                { backgroundColor: theme.colors.bottomSheet }
              ]}
            >
              <AnimatedSwitchCamera 
                size={28} 
                color={theme.colors.title} 
                style={animatedRotateStyled}
              />
            </Pressable>
          </View>
        </CameraView>
      </Reanimated.View>
    )
  }

  if (image.uri) {
    return (
      <View style={styles.takedPictureContainer}>
        <View style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: theme.colors.background }}>
          <Image source={{ uri: image.uri }} resizeMode="contain" width={width / 1.297} height={height / 1.58} />
        </View>
        <View style={styles.takedPictureHorizontal}>
          <Pressable 
            onPress={handleRemoveImage}
            android_ripple={{ 
              borderless: false, 
              foreground: false, 
              color: `${theme.colors.shape}10` 
            }} 
            style={[
              styles.cameraButton, 
              { backgroundColor: theme.colors.shape }
            ]}
          >
            <X size={28} color={theme.colors.title} />
          </Pressable>

          <Pressable 
            onPress={handleDone}
            android_ripple={{ 
              borderless: false, 
              foreground: false, 
              color: `${theme.colors.shape}10` 
            }} 
            style={styles.cameraButton}
          >
            <Check size={28} color={theme.colors.title} />
          </Pressable>
        </View>
      </View>
    )
  }
}

const style = createStyleSheet((theme) => ({
  cameraContainer: {
    flex: 1,
    marginTop: 32,
  },
  container: {
    flex: 1,
    paddingVertical: theme.fonts.size.base * 2,
    backgroundColor: theme.colors.background,
  },
  takedPictureContainer: {
    flex: 1,
    paddingVertical: theme.fonts.size.base * 2,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    marginTop: theme.fonts.size.base * 2
  },
  takedPictureHorizontal: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.fonts.size.base * 2,
    position: 'absolute',
    bottom: 16
  },
  flashButton: {
    width: theme.fonts.size.base * 3,
    height: theme.fonts.size.base * 3,
    borderRadius: theme.fonts.size.base * 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.shape,
    position: 'absolute',
    top: 8,
    right: 16
  },
  cameraButton: {
    padding: theme.fonts.size.base,
    borderRadius: theme.fonts.size.base * 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.fonts.size.base,
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16
  }
}))