
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

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
  const [categories, setCategories] = useState<FoodCategory[]>(initialFoodCategories);
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('');
  const [showMasterList, setShowMasterList] = useState(false);
  const [userNameSet, setUserNameSet] = useState(false);

  const handleAddItem = (categoryId: string) => {
    if (!newItems[categoryId]?.trim()) {
      toast.error('Please enter an item');
      return;
    }

    if (!userNameSet && !userName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!userNameSet && userName.trim()) {
      setUserNameSet(true);
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
              addedBy: userName || 'Anonymous',
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
      <div className="bg-white p-4 rounded-lg shadow-md border border-amber-100">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Food Coordination</h2>
        <p className="text-amber-700 mb-4">Collaborate on grocery lists for planned meals and general items.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
          <div className="flex-1">
            <Input
              placeholder="Your name (required to add items)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={userNameSet}
              className="form-input"
            />
          </div>
          
          {userNameSet && (
            <div className="text-sm text-green-600">Name set: {userName}</div>
          )}
          
          <Button 
            onClick={() => setShowMasterList(!showMasterList)}
            variant="outline"
            className="whitespace-nowrap"
          >
            {showMasterList ? 'Show Categories' : 'Show Master List'}
          </Button>
        </div>
        
        {showMasterList ? (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="text-xl font-bold text-amber-800 mb-3">Master Shopping List</h3>
            {allItems.length === 0 ? (
              <p className="text-amber-700 italic">No items added yet</p>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="mb-3">
                    <h4 className="font-medium text-amber-800">{category.name}</h4>
                    <ul className="pl-5 space-y-1 mt-1">
                      {category.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItemChecked(category.id, item.id)}
                            className="data-[state=checked]:bg-amber-600"
                          />
                          <span className={item.checked ? 'line-through text-amber-400' : 'text-amber-700'}>
                            {item.name}
                          </span>
                          <span className="text-xs text-amber-500">({item.addedBy})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="food-category">
                <h3 className="text-lg font-bold text-amber-900">{category.name}</h3>
                <p className="text-amber-700 italic mb-3">{category.mainItem}</p>
                
                <div className="flex mb-3">
                  <Input
                    placeholder="Add item to list"
                    value={newItems[category.id] || ''}
                    onChange={(e) => setNewItems({
                      ...newItems,
                      [category.id]: e.target.value
                    })}
                    className="form-input flex-1 mr-2"
                  />
                  <Button onClick={() => handleAddItem(category.id)} variant="outline">Add</Button>
                </div>
                
                {category.items.length === 0 ? (
                  <p className="text-amber-400 italic text-sm">No items added yet</p>
                ) : (
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItemChecked(category.id, item.id)}
                          className="data-[state=checked]:bg-amber-600"
                        />
                        <span className={item.checked ? 'line-through text-amber-400' : 'text-amber-700'}>
                          {item.name}
                        </span>
                        <span className="text-xs text-amber-500 ml-auto">Added by: {item.addedBy}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCoordination;
