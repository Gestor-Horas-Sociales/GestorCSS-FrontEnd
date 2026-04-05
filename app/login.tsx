import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with auth API
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="justify-center p-4">
      <View className="mb-8 items-center">
        <Text variant="heading" className="mb-2">
          GestorCSS
        </Text>
        <Text variant="muted">Inicia sesión para continuar</Text>
      </View>

      <Card>
        <Input
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="mb-4"
        />
        <Input
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-6"
        />

        <Button onPress={handleLogin} loading={loading}>
          Iniciar sesión
        </Button>
      </Card>
    </Container>
  );
}
