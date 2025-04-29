import { createComponentClient } from '@/utils/supabase/clients/component'
import { useEffect, useState } from 'react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command'
import { Check, Plus } from "lucide-react"


interface Ingredient{ // format of ingredients stored in supabase
    id: string
    name: string
}

export function IngredientDropdown(){
    const supabase = createComponentClient();
    
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [selectedIngredient, selectIngredient] = useState<Ingredient | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        const loadIngredients = async () => {
            const {data, error} = await supabase.from("ingredients").select("*").order("name", {ascending: true})
            if (data && !error){
                setIngredients(data) // will this format correctly?
            }
        }
        loadIngredients()
    },[supabase]) // run on mount!

    const handleSelectIngredient = (ingredient: Ingredient) => {
        selectIngredient(ingredient)
        setIsOpen(false)
    }

    const addNewIngredient = async () => {
        const newIng = inputValue.toLowerCase()

        if (ingredients.find((ing) => ing.name === newIng)){ // should all be in lowercase already
            return // if it matches existing ingredient, don't want to add new one
        }

        const {data, error} = await supabase.from("ingredients").insert({name: newIng})
        // did i do the insert right? or should it just be insert(newIng)? and do i need .select or .single

        if (data && !error){
            setIngredients([...ingredients, data])
            selectIngredient(data)
            setInputValue("")
            setIsOpen(false)
        }
    }

    return(
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">Add ingredient</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Command>
                    <CommandInput placeholder="Add an ingredient..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={(e) => {
                        if (e.key === "Enter" && ingredients.length === 0) {
                            addNewIngredient()
                        }
                    }}/>
                        <CommandEmpty>No ingredient found, press enter to add this to your list.</CommandEmpty>
                        <CommandGroup>
                            {ingredients.map((ingredient) => (
                                <CommandItem
                                key={ingredient.id}
                                value={ingredient.name}
                                onSelect={() => handleSelectIngredient(ingredient)}
                                >
                                <Check
                                    className={
                                        "mr-2 h-4 w-4 " +
                                        (selectedIngredient?.id === ingredient.id ? "opacity-100" : "opacity-0")
                                    }
                                />
                                {ingredient.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    {inputValue &&
            !ingredients.some(
              (i) => i.name.toLowerCase() === inputValue.toLowerCase()
            ) && (
              <Button
                variant="ghost"
                onClick={addNewIngredient}
            >
                <Plus/> Add “{inputValue}”
              </Button>
            )}
            </Command>
            </PopoverContent>
        </Popover>
    )
}