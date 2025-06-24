import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Clock, MapPin, DollarSign, Smartphone, Mail, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsManagement = () => {
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'Meu Restaurante',
    description: 'O melhor da culinária brasileira',
    phone: '(11) 99999-9999',
    email: 'contato@meurestaurante.com.br',
    website: 'www.meurestaurante.com.br',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  });

  const [deliverySettings, setDeliverySettings] = useState({
    enabled: true,
    freeDeliveryMinOrder: 50,
    deliveryFee: 8.50,
    maxDeliveryDistance: 10,
    estimatedTime: 45
  });

  const [operatingHours, setOperatingHours] = useState([
    { day: 'Segunda-feira', open: '11:00', close: '22:00', enabled: true },
    { day: 'Terça-feira', open: '11:00', close: '22:00', enabled: true },
    { day: 'Quarta-feira', open: '11:00', close: '22:00', enabled: true },
    { day: 'Quinta-feira', open: '11:00', close: '22:00', enabled: true },
    { day: 'Sexta-feira', open: '11:00', close: '23:00', enabled: true },
    { day: 'Sábado', open: '12:00', close: '23:00', enabled: true },
    { day: 'Domingo', open: '12:00', close: '21:00', enabled: false }
  ]);

  const [paymentSettings, setPaymentSettings] = useState({
    pix: { enabled: true, key: 'meurestaurante@pix.com.br' },
    creditCard: { enabled: true },
    debitCard: { enabled: true },
    cash: { enabled: true, changeFor: 100 }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newOrderAlert: true,
    lowStockAlert: true,
    dailyReport: true
  });

  const handleSaveRestaurantInfo = () => {
    console.log('Salvando informações do restaurante:', restaurantSettings);
    toast({
      title: "Configurações salvas!",
      description: "As informações do restaurante foram atualizadas com sucesso.",
    });
  };

  const handleSaveDeliverySettings = () => {
    console.log('Salvando configurações de entrega:', deliverySettings);
    toast({
      title: "Configurações de entrega salvas!",
      description: "As configurações de entrega foram atualizadas com sucesso.",
    });
  };

  const handleSaveOperatingHours = () => {
    console.log('Salvando horário de funcionamento:', operatingHours);
    toast({
      title: "Horário de funcionamento salvo!",
      description: "O horário de funcionamento foi atualizado com sucesso.",
    });
  };

  const handleSavePaymentSettings = () => {
    console.log('Salvando configurações de pagamento:', paymentSettings);
    toast({
      title: "Configurações de pagamento salvas!",
      description: "As formas de pagamento foram atualizadas com sucesso.",
    });
  };

  const handleSaveNotificationSettings = () => {
    console.log('Salvando configurações de notificação:', notificationSettings);
    toast({
      title: "Configurações de notificação salvas!",
      description: "As preferências de notificação foram atualizadas com sucesso.",
    });
  };

  const updateOperatingHour = (index: number, field: string, value: any) => {
    const updated = [...operatingHours];
    updated[index] = { ...updated[index], [field]: value };
    setOperatingHours(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Configurações</h2>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="restaurant">Restaurante</TabsTrigger>
          <TabsTrigger value="delivery">Entrega</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informações do Restaurante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Restaurante</Label>
                  <Input
                    id="name"
                    value={restaurantSettings.name}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={restaurantSettings.phone}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={restaurantSettings.website}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, website: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={restaurantSettings.description}
                  onChange={(e) => setRestaurantSettings({ ...restaurantSettings, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={restaurantSettings.address}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={restaurantSettings.zipCode}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, zipCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={restaurantSettings.city}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={restaurantSettings.state}
                    onChange={(e) => setRestaurantSettings({ ...restaurantSettings, state: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveRestaurantInfo} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar Informações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Configurações de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="delivery-enabled"
                  checked={deliverySettings.enabled}
                  onCheckedChange={(checked) => setDeliverySettings({ ...deliverySettings, enabled: checked })}
                />
                <Label htmlFor="delivery-enabled">Delivery habilitado</Label>
              </div>
              
              {deliverySettings.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="delivery-fee">Taxa de Entrega (R$)</Label>
                      <Input
                        id="delivery-fee"
                        type="number"
                        step="0.01"
                        value={deliverySettings.deliveryFee}
                        onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryFee: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="free-delivery">Entrega Grátis a partir de (R$)</Label>
                      <Input
                        id="free-delivery"
                        type="number"
                        value={deliverySettings.freeDeliveryMinOrder}
                        onChange={(e) => setDeliverySettings({ ...deliverySettings, freeDeliveryMinOrder: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-distance">Distância Máxima (km)</Label>
                      <Input
                        id="max-distance"
                        type="number"
                        value={deliverySettings.maxDeliveryDistance}
                        onChange={(e) => setDeliverySettings({ ...deliverySettings, maxDeliveryDistance: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated-time">Tempo Estimado (min)</Label>
                      <Input
                        id="estimated-time"
                        type="number"
                        value={deliverySettings.estimatedTime}
                        onChange={(e) => setDeliverySettings({ ...deliverySettings, estimatedTime: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <Button onClick={handleSaveDeliverySettings} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações de Entrega
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {operatingHours.map((hour, index) => (
                <div key={hour.day} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={hour.enabled}
                      onCheckedChange={(checked) => updateOperatingHour(index, 'enabled', checked)}
                    />
                    <span className="font-medium min-w-[120px]">{hour.day}</span>
                  </div>
                  
                  {hour.enabled ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hour.open}
                        onChange={(e) => updateOperatingHour(index, 'open', e.target.value)}
                        className="w-24"
                      />
                      <span>às</span>
                      <Input
                        type="time"
                        value={hour.close}
                        onChange={(e) => updateOperatingHour(index, 'close', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  ) : (
                    <Badge variant="secondary">Fechado</Badge>
                  )}
                </div>
              ))}
              
              <Button onClick={handleSaveOperatingHours} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar Horários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Formas de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={paymentSettings.pix.enabled}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          pix: { ...paymentSettings.pix, enabled: checked }
                        })
                      }
                    />
                    <span className="font-medium">PIX</span>
                  </div>
                  {paymentSettings.pix.enabled && (
                    <Input
                      placeholder="Chave PIX"
                      value={paymentSettings.pix.key}
                      onChange={(e) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          pix: { ...paymentSettings.pix, key: e.target.value }
                        })
                      }
                      className="max-w-xs"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={paymentSettings.creditCard.enabled}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          creditCard: { ...paymentSettings.creditCard, enabled: checked }
                        })
                      }
                    />
                    <span className="font-medium">Cartão de Crédito</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={paymentSettings.debitCard.enabled}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          debitCard: { ...paymentSettings.debitCard, enabled: checked }
                        })
                      }
                    />
                    <span className="font-medium">Cartão de Débito</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={paymentSettings.cash.enabled}
                      onCheckedChange={(checked) => 
                        setPaymentSettings({
                          ...paymentSettings,
                          cash: { ...paymentSettings.cash, enabled: checked }
                        })
                      }
                    />
                    <span className="font-medium">Dinheiro</span>
                  </div>
                  {paymentSettings.cash.enabled && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Troco para:</span>
                      <Input
                        type="number"
                        value={paymentSettings.cash.changeFor}
                        onChange={(e) => 
                          setPaymentSettings({
                            ...paymentSettings,
                            cash: { ...paymentSettings.cash, changeFor: parseInt(e.target.value) }
                          })
                        }
                        className="w-20"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <Button onClick={handleSavePaymentSettings} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar Formas de Pagamento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Notificações por E-mail</div>
                    <div className="text-sm text-gray-600">Receber notificações gerais por e-mail</div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Notificações por SMS</div>
                    <div className="text-sm text-gray-600">Receber notificações por SMS</div>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Alerta de Novos Pedidos</div>
                    <div className="text-sm text-gray-600">Notificar quando houver novos pedidos</div>
                  </div>
                  <Switch
                    checked={notificationSettings.newOrderAlert}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, newOrderAlert: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Alerta de Estoque Baixo</div>
                    <div className="text-sm text-gray-600">Notificar quando o estoque estiver baixo</div>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlert}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, lowStockAlert: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Relatório Diário</div>
                    <div className="text-sm text-gray-600">Receber relatório diário de vendas</div>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyReport}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, dailyReport: checked })
                    }
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotificationSettings} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
