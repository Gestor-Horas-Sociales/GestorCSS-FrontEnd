import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

export default function ProfileScreen() {
  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text variant="heading" className="mb-6">
            Perfil
          </Text>

          <Card className="mb-4">
            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
                <Text className="text-white text-2xl font-bold">U</Text>
              </View>
              <Text variant="subheading">Usuario</Text>
              <Text variant="muted">usuario@example.com</Text>
            </View>
          </Card>

          <Card className="mb-4">
            <Text variant="subheading" className="mb-3">
              Estadísticas
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text variant="heading">0</Text>
                <Text variant="muted">Horas</Text>
              </View>
              <View className="items-center">
                <Text variant="heading">0</Text>
                <Text variant="muted">Actividades</Text>
              </View>
              <View className="items-center">
                <Text variant="heading">0</Text>
                <Text variant="muted">Aprobadas</Text>
              </View>
            </View>
          </Card>

          <Button variant="outline" onPress={() => {}}>
            Cerrar sesión
          </Button>
        </View>
      </ScrollView>
    </Container>
  );
}
