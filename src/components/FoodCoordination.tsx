
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface FoodItem {
  id: string;
  name: string;
  addedBy: string;
  checked: boolean;
}

interface FoodCategory {
  id: string;
  name: string;
  mainItem: string;
  items: FoodItem[];
}

const initialFoodCategories: FoodCategory[] = [
  { 
    id: '1', 
    name: 'Dinner - Day 1', 
    mainItem: 'Hamburgers',
    items: []
  },
  { 
    id: '2', 
    name: 'Lunch - Day 1', 
    mainItem: 'Sandwiches & Salads',
    items: []
  },
  { 
    id: '3', 
    name: 'Dinner - Day 2', 
    mainItem: 'Taco Night',
    items: []
  },
  { 
    id: '4', 
    name: 'Lunch - Day 2', 
    mainItem: 'Pasta Salad',
    items: []
  },
  { 
    id: '5', 
    name: 'Breakfast Items', 
    mainItem: 'General breakfast needs',
    items: []
  },
  { 
    id: '6', 
    name: 'Miscellaneous & Snacks', 
    mainItem: 'Snacks, drinks, etc.',
    items: []
  },
];

const FoodCoordination = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState<FoodCategory[]>(initialFoodCategories);
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [showMasterList, setShowMasterList] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleAddItem = (categoryId: string) => {
    if (!newItems[categoryId]?.trim()) {
      toast.error('Please enter an item');
      return;
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [
            ...category.items,
            {
              id: Date.now().toString(),
              name: newItems[categoryId].trim(),
              addedBy: currentUser?.username || 'Anonymous',
              checked: false
            }
          ]
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setNewItems({
      ...newItems,
      [categoryId]: ''
    });

    toast.success(`Added ${newItems[categoryId]} to ${categories.find(c => c.id === categoryId)?.name}`);
  };

  const toggleItemChecked = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          })
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const allItems = categories.flatMap(category => 
    category.items.map(item => ({
      ...item,
      category: category.name
    }))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border border-[#e8e8d5]">
        <h2 className="text-2xl font-bold text-[#4a3c31] mb-2">Food Coordination</h2>
        <p className="text-[#867e74] mb-4">Collaborate on grocery lists for planned meals and general items.</p>
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowMasterList(!showMasterList)}
            variant="outline"
            className="border-[#e8e8d5] text-[#4a3c31] hover:bg-[#f0e6e4]"
          >
            {showMasterList ? 'Show Categories' : 'Show Master List'}
          </Button>
        </div>
        
        {showMasterList ? (
          <div className="bg-[#f9f5f0] p-4 rounded-lg border border-[#e8e8d5]">
            <h3 className="text-xl font-bold text-[#4a3c31] mb-3">Master Shopping List</h3>
            {allItems.length === 0 ? (
              <p className="text-[#867e74] italic">No items added yet</p>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  category.items.length > 0 && (
                    <div key={category.id} className="mb-3">
                      <h4 className="font-medium text-[#4a3c31]">{category.name}</h4>
                      <ul className="pl-5 space-y-1 mt-1">
                        {category.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => toggleItemChecked(category.id, item.id)}
                              className="data-[state=checked]:bg-[#947b5f] border-[#d1cdc3]"
                            />
                            <span className={item.checked ? 'line-through text-[#b9b3aa]' : 'text-[#4a3c31]'}>
                              {item.name}
                            </span>
                            <span className="text-xs text-[#867e74] ml-1">({item.addedBy})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#f0e6e4] mb-4 overflow-x-auto flex w-full justify-start">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#4a3c31] text-[#867e74]"
              >
                Overview
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-[#4a3c31] text-[#867e74]"
                >
                  {category.name.split(' - ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="bg-white p-4 rounded-lg border border-[#e8e8d5] hover:shadow-md transition-shadow"
                    onClick={() => setActiveTab(category.id)}
                  >
                    <h3 className="text-lg font-bold text-[#4a3c31]">{category.name}</h3>
                    <p className="text-[#867e74] italic mb-2">{category.mainItem}</p>
                    
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-[#867e74]">
                        {category.items.length} items
                      </span>
                      <Button 
                        variant="link" 
                        className="text-[#947b5f] p-0 h-auto hover:text-[#7f6a52]"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="bg-white p-4 rounded-lg border border-[#e8e8d5]">
                  <h3 className="text-lg font-bold text-[#4a3c31] mb-1">{category.name}</h3>
                  <p className="text-[#867e74] italic mb-3">{category.mainItem}</p>
                  
                  <div className="flex mb-3">
                    <Input
                      placeholder="Add item to list"
                      value={newItems[category.id] || ''}
                      onChange={(e) => setNewItems({
                        ...newItems,
                        [category.id]: e.target.value
                      })}
                      className="border-[#d1cdc3] mr-2"
                    />
                    <Button 
                      onClick={() => handleAddItem(category.id)}
                      className="bg-[#947b5f] hover:bg-[#7f6a52] text-white"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {category.items.length === 0 ? (
                    <p className="text-[#b9b3aa] italic text-sm">No items added yet</p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto pr-1">
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2 border-b border-[#f0e6e4] pb-2">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => toggleItemChecked(category.id, item.id)}
                              className="data-[state=checked]:bg-[#947b5f] border-[#d1cdc3]"
                            />
                            <span className={item.checked ? 'line-through text-[#b9b3aa]' : 'text-[#4a3c31]'}>
                              {item.name}
                            </span>
                            <span className="text-xs text-[#867e74] ml-auto">Added by: {item.addedBy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default FoodCoordination;
