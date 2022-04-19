/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Quiz } from './screens';
import {COLORS, SIZES} from './constants';
import data from './data/QuizData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const App = () => {

  const allQuestions = data ;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null); // seçilen cevap
  const [correctOption, setCorrectOption] = useState(null); // doğru cavap kontrolü için 
  const [isOptionDisabled, setIsOptionDisabled] = useState(false); // cevabı devre dısı bırakmak için 
  const [score, setScore] = useState(0); 
  const [showNextButton, setShowNextButton] = useState(false); 
  const [showScoreModal, setShowScoreModal] = useState(false); 



  const validateAnswer = (selectedOption) => {
    let correct_option = allQuestions[currentQuestionIndex]['correct_option'];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionDisabled(true);

    if (selectedOption == correct_option) {
        //set score 
        setScore(score+1);
        
    }
    //Show next Button 
    setShowNextButton(true)
  };

  const handleNext = () => {
    if(currentQuestionIndex == allQuestions.length-1) {
      //son soru 
      // score model gösterim
      setShowScoreModal(true)
    }
    else {
      setCurrentQuestionIndex(currentQuestionIndex+1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionDisabled(false);
      setShowNextButton(false);
    }
    Animated.timing(progress, { toValue: currentQuestionIndex+1, 
                               duration: 1000, 
                               useNativeDriver:false}).start();
  }

  const restartQuiz = () => {
    setShowScoreModal(false);

    setCurrentQuestionIndex(0);
    setScore(0);

    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionDisabled(false);
    setShowNextButton(false);
    Animated.timing(progress,{ toValue: 0, 
      duration: 1000, 
      useNativeDriver:false}).start();
  }



  const renderQuestion = () => {
   return(
    <View style={{marginVertical:40}}>
    {/*soru hesaplayıcı */}
    <View style={{flexDirection: 'row', alignItems:'flex-end'}}>
      <Text style={{color:COLORS.white, fontSize: 20, opacity:0.6, marginRight: 2 }}>{currentQuestionIndex+1}</Text>
      <Text style={{color:COLORS.white, fontSize: 20, opacity:0.6, marginRight: 2 }}>/ {allQuestions.length}</Text>
    </View>

    {/* Sorular */}
    <Text style={{color:COLORS.white, fontSize: 30 }}>{allQuestions[currentQuestionIndex]?.question}</Text>
  </View>
   )
  } ;
  const renderOptions = () => {
      return(
        <View>
        {
          allQuestions[currentQuestionIndex]?.options.map(option => (
            
            <TouchableOpacity onPress={ () => validateAnswer(option)}
                              disabled={isOptionDisabled}
                              key={option} 
                              style={{ borderWidth: 3, 
                                       borderColor: option==correctOption ? COLORS.succes :
                                          option==currentOptionSelected ? COLORS.error : COLORS.secondary+'40', 
                                       backgroundColor: option==correctOption ? COLORS.succes+'20' :
                                          option==currentOptionSelected ? COLORS.error+'20' :COLORS.secondary+'20', 
                                       height: 60, borderRadius:30,
                                       flexDirection:'row', alignItems:'center', justifyContent: 'space-between',
                                       paddingHorizontal: 20 , marginVertical: 10  }}> 
            <Text style={{ fontSize: 20, color: COLORS.white }}>{option} </Text> 
            {/* Cevaba göre  tik veya çarpı işareti gösterme */}
            {
              option == correctOption ? (
                <View style={{
                              width:30, height:30, borderRadius:30/2, backgroundColor: COLORS.succes,
                              justifyContent:'center', alignItems:'center'
                             }}>
                 <MaterialCommunityIcons name='check' style={{ color: COLORS.white, fontSize:20 }} /> 
                 </View>
              ) : option == currentOptionSelected ? (
                <View style={{
                            width:30, height:30, borderRadius:30/2, backgroundColor: COLORS.error,
                            justifyContent:'center', alignItems:'center'
                            }} >
                 <MaterialCommunityIcons name='close' style={{ color: COLORS.white, fontSize:20 }} />
                 </View>
              ) : null
            }
            </TouchableOpacity>
          ))
          
        }
      </View>
      )
      
  };
  const renderNextButton = () => {
      if (showNextButton) {
        return(
        <TouchableOpacity 
          onPress={handleNext}
          style={{ marginTop:20, width:'100%', backgroundColor:COLORS.accent, padding:20, borderRadius:5 }}>
          <Text style={{fontSize: 20, color: COLORS.white, textAlign:'center'}}>İleri</Text>
        </TouchableOpacity>
        )
      }
      else {
        return null
      }
      
  }
  const [progress, setProgress] = useState(new Animated.Value(0)); 
  const progressAnim = progress.interpolate({ inputRange: [0, allQuestions.length], outputRange: ['0%', '100%']})
  const renderProgressBar = () => {
    return(
      <View style={{ width: '100%', height:20, borderRadius:20, backgroundColor:'#00000020',}}>
        <Animated.View style={[{ height: 20, borderRadius:20, backgroundColor: COLORS.accent},{width: progressAnim}]}>

        </Animated.View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, }}>
      <StatusBar barStyle='light-content' backgroundColor={COLORS.primary} />
      <View style={{flex: 1, paddingVertical: 40, paddingHorizontal:16, backgroundColor:COLORS.background , position:'relative' }}>

        {/*ProgressBar */}

        {renderProgressBar()}

        {/*Question */}
        {renderQuestion()}


        {/*Options */}
        {renderOptions()}

        {/*Next Button */}
        {renderNextButton()}
        {/*Score Modal*/}
        <Modal
        animationType='slide'
        transparent={true}
        visible={showScoreModal}
        >
          <View style={{flex:1, backgroundColor:COLORS.primary, alignItems:'center',justifyContent:'center'}}> 
            <View style={{backgroundColor: COLORS.white, width: '90%', borderRadius:20, padding: 20, alignItems:'center'}}>
              <Text style= {{fontSize: 30, fontWeight:'bold' }}> { score> (allQuestions.length/2) ? 'Tebrikler ! ' : 'Oppss ' } </Text>
              <View style= {{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginVertical:20 }}>
                <Text style={{fontSize: 30, color: score> (allQuestions.length/2) ? COLORS.succes : COLORS.error}}> { score }</Text>
                <Text style={{fontSize:20, color: COLORS.black}}>/ { allQuestions.length }</Text>
              </View>
              {/*Retry Quiz Button*/}
              <TouchableOpacity onPress={restartQuiz}
                                style= {{ backgroundColor: COLORS.accent, padding:20, width: ' 100%', borderRadius: 20}}>
                <Text style={{textAlign:'center', color: COLORS.white, fontSize:20}}>Tekrar Dene</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/*BackGround Image */}
        <Image 
          source={require('./assets/images/DottedBG.png')}
          style={{
            width: SIZES.width , 
            height:130, 
            zIndex: -1, 
            position: 'absolute', 
            bottom: 0, 
            left: 0 , 
            right: 0,
            opacity:0.5 }}
            resizeMode={'contain'}
        />

      </View> 
    </SafeAreaView>
   
  );
};



export default App;
