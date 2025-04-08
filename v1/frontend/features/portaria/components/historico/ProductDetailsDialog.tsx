import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "ui";
import { ProductMovementTimeline } from ".";
import { AnimatedButton } from "#/incluir/components/buttons";
import { Eye } from "lucide-react";

interface ProductDetailsDialogProps {
  produtos: any[];
}

export const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  produtos,
}) => {
  const [activeTab, setActiveTab] = useState(produtos[0]?.ProdutoCod);
  const [open, setOpen] = useState(false);

  const tabVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AnimatedButton
        icon={<Eye className="h-4 w-4 " />}
        text="Detalhes"
        variant="secondary"
        isDialog
      />

      <DialogContent className="max-w-4xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalhes dos Produtos</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <TabsList className="w-full flex mb-4 relative shrink-0">
            {produtos.map((produto) => (
              <TabsTrigger
                key={produto.ProdutoCod}
                value={produto.ProdutoCod}
                className="truncate text-start w-full relative"
              >
                {produto.ProdutoDesc}
                {activeTab === produto.ProdutoCod && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="flex">
            <AnimatePresence mode="wait">
              {produtos.map(
                (produto) =>
                  activeTab === produto.ProdutoCod && (
                    <motion.div
                      key={produto.ProdutoCod}
                      variants={tabVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="h-full w-full flex"
                    >
                      <ProductMovementTimeline
                        movimentacoes={produto.Movimentacoes}
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
