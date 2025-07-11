
import { useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types';

interface MenuPanelProps {
  menuItems: MenuItem[];
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>) => void;
}

const MenuPanel = ({ menuItems, onUpdateMenuItem, onDeleteMenuItem, onAddMenuItem }: MenuPanelProps) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'entrada' as const,
    image_url: '',
    available: true
  });

  const handleSaveEdit = useCallback(() => {
    if (editingItem) {
      onUpdateMenuItem(editingItem);
      setEditingItem(null);
    }
  }, [editingItem, onUpdateMenuItem]);

  const handleAddNew = useCallback(() => {
    onAddMenuItem(newItem);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'entrada',
      image_url: '',
      available: true
    });
    setShowAddForm(false);
  }, [newItem, onAddMenuItem]);

  const categoryLabels = {
    entrada: 'Entrada',
    principal: 'Prato Principal',
    bebida: 'Bebida',
    sobremesa: 'Sobremesa'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gerenciar Cardápio</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adicionar Novo Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nome do prato"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Textarea
              placeholder="Descrição"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Preço"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
            />
            <Select
              value={newItem.category}
              onValueChange={(value) => setNewItem({ ...newItem, category: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="principal">Prato Principal</SelectItem>
                <SelectItem value="bebida">Bebida</SelectItem>
                <SelectItem value="sobremesa">Sobremesa</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="URL da imagem"
              value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddNew} className="bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              {editingItem?.id === item.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                  <Textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                  <Input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" className="bg-green-500 hover:bg-green-600">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_url || ''}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-bold text-green-600">R$ {item.price.toFixed(2)}</span>
                        <Badge>{categoryLabels[item.category]}</Badge>
                        {!item.available && <Badge variant="destructive">Indisponível</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteMenuItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuPanel;
