import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/clients/server-props'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createComponentClient } from '@/utils/supabase/clients/component';
import { useEffect, useState } from "react";
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type GroceryItem = {
  id: string;
  name: string;
  completed: boolean;
  user_id: string;
};

export default function List({ user }: { user: User }) {
    const supabase = createComponentClient();
  
    const [items, setItems] = useState<GroceryItem[]>([]);
    const [newItem, setNewItem] = useState("");
  
    useEffect(() => {
      if (user.id) fetchItems();
    }, [user.id, supabase]);
  
    async function fetchItems() {
      const { data } = await supabase
        .from("grocery_list")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: true });
      if (data) setItems(data);
    }
  
    async function addItem() {
      if (!newItem.trim()) return;
      const { data } = await supabase
        .from("grocery_list")
        .insert([{ name: newItem, completed: false, user_id: user.id }])
        .select()
        .single();
      if (data) setItems((items) => [...items, data]);
      setNewItem("");
    }
  
    async function removeItem(id: string) {
      await supabase.from("grocery_list").delete().eq("id", id);
      setItems(items => items.filter(item => item.id !== id));
    }
  
    async function toggleCompletion(id: string, completed: boolean) {
      await supabase
        .from("grocery_list")
        .update({ completed })
        .eq("id", id);
      setItems(items => items.map(item => 
        item.id === id ? { ...item, completed } : item
      ));
    }
  
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="p-8">
          <SidebarTrigger className="my-6 mx-10" />
          <h1 className="text-3xl font-semibold mb-6">Let&apos;s go shopping!</h1>
            <div className="flex items-center mb-4 space-x-2">
            <Input
              type="text"
              value={newItem}
              placeholder="Add new ingredient"
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addItem(); }}
              className="w-full max-w-xs"
            />
            <Button 
              onClick={addItem}
              className="w-24"
            >
              Add
            </Button>
          </div>
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex items-center space-x-4">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleCompletion(item.id, !item.completed)}
                />
                <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                  {item.name}
                </span>
                <Button 
                  onClick={() => removeItem(item.id)} 
                  variant="link" 
                  className="text-red-500"
                >
                  <Trash />
                </Button>
              </li>
            ))}
          </ul>
        </main>
      </SidebarProvider>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)
    const { data, error } = await supabase.auth.getUser()
    if (error || !data) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }
    return {
      props: {
        user: data.user,
      },
    }
  }
