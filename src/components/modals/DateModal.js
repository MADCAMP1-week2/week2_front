// import { Modal, View, Dimensions, Pressable } from 'react-native';
// import Animated, { SlideInUp, SlideOutDown } from 'react-native-reanimated';
// import { useModalStore } from '@store/modalStore';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// export function DateModal() {
//   const { visible, modalDateKey, hideModal } = useModalStore();

//   if (!visible) return null;

//   return (
//     <Modal transparent animationType="none" visible={visible} onRequestClose={hideModal}>
//       <Pressable style={{ flex: 1 }} onPress={hideModal} />
//       <Animated.View
//         entering={SlideInUp.duration(250)}
//         exiting={SlideOutDown.duration(250)}
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           width: '100%',
//           backgroundColor: '#fff',
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//           padding: 20,
//         }}
//       >
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{modalDateKey} 일정</Text>
//         {/* 여기에 해당 날짜 일정 등 표시 */}
//       </Animated.View>
//     </Modal>
//   );
// }
