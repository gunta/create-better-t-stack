import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace("/");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 justify-center p-8">
      {!pendingVerification && (
        <View className="gap-4">
          <Text className="text-3xl font-bold text-center mb-4">Sign Up</Text>
          
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
            className="border border-gray-300 rounded-lg p-3"
          />
          
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            className="border border-gray-300 rounded-lg p-3"
          />
          
          <TouchableOpacity 
            onPress={onSignUpPress}
            className="bg-blue-500 rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {pendingVerification && (
        <View className="gap-4">
          <Text className="text-2xl font-bold text-center mb-4">
            Verify your email
          </Text>
          <Text className="text-center text-gray-600 mb-4">
            We sent a verification code to {emailAddress}
          </Text>
          
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
            className="border border-gray-300 rounded-lg p-3"
          />
          
          <TouchableOpacity 
            onPress={onPressVerify}
            className="bg-blue-500 rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              Verify Email
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}