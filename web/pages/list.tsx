import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/clients/server-props'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createComponentClient } from '@/utils/supabase/clients/component';
import { useEffect, useState } from "react";


type GroceryItem = {
  id: string;
  name: string;
  completed: boolean;
  user_id: string;
};

export default function List({ user }: { user: User }) {
    const supabase = createComponentClient();
  
    // const [ingredientsList, setIngredientsList] = useState<IngredientType[]>([]);
    // type IngredientType = z.infer<typeof Ingredient>; // dying

    const [items, setItems] = useState<GroceryItem[]>([]);
    const [newItem, setNewItem] = useState("");
  
    useEffect(() => {
      fetchItems();
    }, );
  
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
  
  
  return (
      <SidebarProvider>
        <AppSidebar />
        <main style={{ padding: "2rem" }}>
        <SidebarTrigger className='my-[1.5rem] mx-[2.5rem]' />
      <h1>Grocery List</h1>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          value={newItem}
          placeholder="Add new ingredient"
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") addItem(); }}
        />
        <button onClick={addItem} style={{ marginLeft: 8 }}>Add</button>
      </div>
      <ul>
        {items.map(item =>
          <li key={item.id} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1 }}>{item.name}</span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        )}
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