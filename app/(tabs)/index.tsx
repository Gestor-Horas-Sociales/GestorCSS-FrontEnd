import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

export default function HomeScreen() {
  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text variant="heading" className="mb-4">
            GestorCSS
          </Text>
          <Text variant="muted" className="mb-6">
            Bienvenido al gestor de horas sociales
          </Text>

          <Card className="mb-4">
            <Text variant="subheading" className="mb-2">
              Resumen
            </Text>
            <Text>Total horas registradas: 0</Text>
          </Card>

          <Card className="mb-6">
            <Text variant="subheading" className="mb-2">
              Actividades recientes
            </Text>
            <Text variant="muted">No hay actividades registradas.</Text>
          </Card>

          <Button onPress={() => {}}>Ver todas las actividades</Button>
        </View>
      </ScrollView>
    </Container>
  );
}
