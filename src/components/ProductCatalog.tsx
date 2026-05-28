import React, { useState, useId } from 'react';
import { Product } from '../types';
import { Plus, Trash2, Edit2, Package, Sparkles, Scale, Info, Check, RefreshCw, Layers, ExternalLink, X, Heart } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  isAdmin?: boolean;
  onOpenAuth?: (tab: 'client_login' | 'client_register' | 'admin_login') => void;
}

const CATEGORIES = ["Todos", "Pele Sensível", "Pele Oleosa", "Pele Mista", "Esfoliante Suave"];
const CHOOSE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1607006342461-9010df2327cf?auto=format&fit=crop&q=80&w=600", label: "Lavanda & Karité (Roxo/Rústico)" },
  { url: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600", label: "Argila & Alecrim (Verde Claro)" },
  { url: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600", label: "Mel & Aveia (Neutro Cremoso)" },
  { url: "https://images.unsplash.com/photo-1628143431362-79366624a0d9?auto=format&fit=crop&q=80&w=600", label: "Copaíba (Amarelado Ervas)" },
  { url: "https://images.unsplash.com/photo-1602930044438-492d5be6a022?auto=format&fit=crop&q=80&w=600", label: "Calêndula & Citrus (Alaranjado)" },
];

export default function ProductCatalog({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onResetProducts, 
  isAdmin = false,
  onOpenAuth
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Custom modal/toast states instead of Native Alerts
  const [activeNotification, setActiveNotification] = useState<{title: string, message: string} | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states for adding/editing
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(22.90);
  const [weight, setWeight] = useState<number>(110);
  const [category, setCategory] = useState('Pele Sensível');
  const [stock, setStock] = useState<number>(10);
  const [imgUrl, setImgUrl] = useState(CHOOSE_IMAGES[0].url);
  const [ingredientsText, setIngredientsText] = useState('Óleo de coco, Óleo de oliva, Extrato natural, Óleos essenciais');
  const [benefitsText, setBenefitsText] = useState('Hidratante, Calmante, Suave');

  const [formError, setFormError] = useState('');

  // Handle submit (save or add)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setFormError('Por favor preencha o Nome e a Descrição do sabonete.');
      return;
    }
    setFormError('');

    const ingredients = ingredientsText.split(',').map(s => s.trim()).filter(Boolean);
    const benefits = benefitsText.split(',').map(s => s.trim()).filter(Boolean);

    if (editingId) {
      // Find and update
      const existing = products.find(p => p.id === editingId);
      if (existing) {
        onUpdateProduct({
          ...existing,
          name,
          description,
          price: Number(price),
          weight: Number(weight),
          category,
          stock: Number(stock),
          image: imgUrl,
          ingredients,
          benefits
        });
      }
      setEditingId(null);
    } else {
      // Create new
      const newSoap: Product = {
        id: `prod-custom-${Date.now()}`,
        name,
        description,
        price: Number(price),
        weight: Number(weight),
        category,
        stock: Number(stock),
        image: imgUrl,
        ingredients,
        benefits,
        isCustomized: true
      };
      onAddProduct(newSoap);
    }

    // Reset fields
    setName('');
    setDescription('');
    setPrice(22.90);
    setWeight(110);
    setStock(10);
    setIngredientsText('Óleo de coco, Óleo de oliva, Extrato natural, Óleos essenciais');
    setBenefitsText('Hidratante, Calmante, Suave');
  };

  const startEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setWeight(prod.weight);
    setCategory(prod.category);
    setStock(prod.stock);
    setImgUrl(prod.image);
    setIngredientsText(prod.ingredients.join(', '));
    setBenefitsText(prod.benefits.join(', '));
    setIsAdminOpen(true);
    // Scroll smoothly to form
    const elem = document.getElementById('catalog-admin-heading');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice(22.90);
    setWeight(100);
    setStock(10);
  };

  // Filter products
  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="catalogo" className="py-24 relative overflow-hidden bg-[#f0f4f0]/30">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-sage-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 bg-emerald-100/30 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/40 border border-white/50 backdrop-blur-md rounded-full text-xs font-semibold text-sage-800">
            <Package className="h-3.5 w-3.5 text-[#2d5a27]" />
            <span>Nossas Coleções Botânicas Ativas</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#1a3317] tracking-tight">
            Catálogo de Sabonetes <span className="italic font-normal text-[#2d5a27]">Artesanais</span>
          </h2>
          <p className="text-sm text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Consulte a disponibilidade ao vivo de nossas barras ricas em óleos puros e curadas por 4 semanas. Você pode modificar, excluir ou adicionar novos produtos manualmente para gerenciar seu estoque e catálogo.
          </p>
        </div>

        {/* Category Filter and Admin Actions */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/40">
          
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2d5a27] text-white shadow-md shadow-emerald-950/10"
                    : "bg-white/40 text-sage-800 hover:bg-white/80 border border-white/50 backdrop-blur-xs"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Manager Toggle */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#2d5a27] hover:text-[#1a3317] bg-white hover:bg-emerald-50 rounded-full transition-all cursor-pointer border border-[#2d5a27]/30 shadow-xs animate-fadeIn"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isAdminOpen ? "Fechar Gerenciador" : "Cadastrar Produto"}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth?.('admin_login')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#2d5a27] hover:text-[#1a3317] bg-white/70 hover:bg-white rounded-full transition-all cursor-pointer border border-[#2d5a27]/20 shadow-2xs"
                title="Apenas a administradora (Saboeira) pode cadastrar produtos. Clique para fazer login."
              >
                <Plus className="h-3.5 w-3.5 text-[#2d5a27]" />
                <span>Cadastrar Produto</span>
              </button>
            )}

            {isAdmin && products.length !== 4 && (
              <button
                onClick={onResetProducts}
                className="p-2.5 text-sage-600 hover:text-sage-800 bg-white/50 hover:bg-white/80 rounded-full transition-all cursor-pointer border border-white/60 backdrop-blur-xs"
                title="Restaurar catálogo inicial"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Admin Form Panel for Soap additions (Manual Stock management as requested) */}
        {isAdminOpen && (
          <div id="catalog-admin-heading" className="mt-8 p-6 bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 animate-fadeIn space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-md text-[#1a3317] flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-[#2d5a27]" />
                  {editingId ? "Editar Informações do Produto" : "Incluir Novo Sabonete no Catálogo"}
                </h3>
                <p className="text-xs text-gray-500">Todo produto novo adicionado será listado imediatamente abaixo com seu respectivo estoque e categoria na landing page.</p>
              </div>
              {editingId && (
                <button onClick={cancelEdit} className="text-xs text-red-600 underline font-semibold cursor-pointer">
                  Cancelar Edição
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              <div className="md:col-span-4 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Nome do Sabonete *</label>
                <input
                  type="text"
                  placeholder="Ex: Hibisco & Argila Rosa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:ring-1 focus:ring-[#2d5a27] focus:outline-none"
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:ring-1 focus:ring-[#2d5a27] focus:outline-none"
                >
                  <option value="Pele Sensível">Pele Sensível</option>
                  <option value="Pele Oleosa">Pele Oleosa</option>
                  <option value="Pele Mista">Pele Mista</option>
                  <option value="Esfoliante Suave">Esfoliante Suave</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:outline-none"
                />
              </div>

              <div className="md:col-span-1.5 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Peso (g)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Estoque (Qtd)</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value) || 0)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:outline-none"
                />
              </div>

              <div className="md:col-span-12 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Características Terapêuticas *</label>
                <input
                  type="text"
                  placeholder="Descreva as propriedades para a saúde da pele do cliente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:outline-none"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 flex items-center justify-between uppercase tracking-wider">
                  <span>Ingredientes (por vírgula)</span>
                </label>
                <input
                  type="text"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:outline-none"
                />
              </div>

              <div className="md:col-span-6 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 flex items-center justify-between uppercase tracking-wider">
                  <span>Benefícios Principais</span>
                </label>
                <input
                  type="text"
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  className="w-full text-xs p-3 bg-white/70 border border-white/60 rounded-xl focus:outline-none"
                />
              </div>

              <div className="md:col-span-12 space-y-1">
                <label className="block text-[11px] font-bold text-sage-800 uppercase tracking-wider">Imagem Representativa</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CHOOSE_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => setImgUrl(img.url)}
                      className={`relative rounded-xl overflow-hidden border-2 h-14 transition-all cursor-pointer ${
                        imgUrl === img.url ? "border-[#2d5a27] scale-95" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt="Soap preview option" className="w-full h-full object-cover" />
                      {imgUrl === img.url && (
                        <span className="absolute inset-0 bg-[#2d5a27]/30 flex items-center justify-center text-white">
                          <Check className="h-5 w-5 bg-[#2d5a27] rounded-full p-1" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="md:col-span-12 p-3 bg-red-50/80 border border-red-200/50 rounded-xl text-xs text-red-600">
                  {formError}
                </div>
              )}

              <div className="md:col-span-12 pt-2 flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full text-xs font-bold text-white bg-[#2d5a27] hover:bg-[#1a3317] transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{editingId ? "Salvar Alterações" : "Inserir Produto no Catálogo"}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Catalog SOAP grid list */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white/40 border border-white/50 backdrop-blur-md rounded-3xl p-4 hover:border-white/90 hover:shadow-2xl hover:bg-white/55 transition-all duration-500 relative"
              >
                {/* Visual Image container */}
                <div className="relative rounded-2xl overflow-hidden bg-white/30 h-52">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating category tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 backdrop-blur-xs border border-white/30 text-[9px] font-extrabold uppercase tracking-wider text-[#2d5a27] rounded-full">
                    {product.category}
                  </span>

                  {/* Stock level indicators */}
                  {isOutOfStock ? (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-red-600/95 text-white text-[9px] font-black rounded-lg uppercase shadow-sm">
                      Esgotado
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-amber-500/95 text-white text-[9px] font-black rounded-lg uppercase shadow-sm animate-pulse">
                      Últimas {product.stock}
                    </span>
                  ) : (
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#2d5a27]/90 text-white text-[9px] font-bold rounded-lg uppercase shadow-sm">
                      {product.stock} em estoque
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="mt-4 flex flex-1 flex-col space-y-3">
                  <h3 className="font-display font-bold text-lg text-sage-950 tracking-tight leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 font-light">
                    {product.description}
                  </p>

                  {/* Key Benefits labels */}
                  <div className="flex flex-wrap gap-1">
                    {product.benefits.slice(0, 3).map((b, i) => (
                      <span key={i} className="text-[10px] text-[#2d5a27] bg-[#2d5a27]/10 px-2.5 py-0.5 rounded-full border border-[#2d5a27]/10 font-medium">
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Weight tag */}
                  <div className="text-[9px] text-gray-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <Scale className="h-3 w-3 text-[#2d5a27]" />
                    <span>Aproximadamente {product.weight}g</span>
                  </div>

                  {/* Ingredients simple list */}
                  <div className="text-[11px] p-2 bg-white/50 rounded-xl border border-white/40">
                    <span className="text-gray-400 text-[9px] font-bold block uppercase tracking-wider">Ingredientes:</span>
                    <span className="line-clamp-2 mt-0.5 text-xs text-gray-500 font-light leading-normal">{product.ingredients.join(', ')}</span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Price and Manager actions */}
                  <div className="pt-3 border-t border-white/40 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">Preço</span>
                      <span className="text-xl font-extrabold text-[#1a3317]">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Shop Affiliate popup indicator button */}
                      <button
                        onClick={() => setActiveNotification({
                          title: "Redirecionamento Afiliado",
                          message: `Você está sendo direcionada para sua Loja Afiliada do Mercado Livre oficial para adquirir o sabonete "${product.name}". Esse processo é seguro!`
                        })}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          isOutOfStock 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-[#ffe600] text-[#2d3277] hover:opacity-90 cursor-pointer shadow-xs"
                        }`}
                        disabled={isOutOfStock}
                      >
                        Comprar
                      </button>

                      {/* Editing actions only when Admin controls toggle is showing and user is admin */}
                      {isAdmin && isAdminOpen && (
                        <div className="flex bg-white/70 p-1 border border-white/60 rounded-full shadow-xs">
                          <button
                            onClick={() => startEditProduct(product)}
                            className="p-1.5 text-sky-600 hover:bg-white rounded-full transition-colors cursor-pointer"
                            title="Editar especificações"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(product.id)}
                            className="p-1.5 text-red-600 hover:bg-white rounded-full transition-colors cursor-pointer"
                            title="Remover sabonete do catálogo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Empty state when filters return nothing */}
        {filteredProducts.length === 0 && (
          <div className="mt-12 text-center p-12 bg-white/40 backdrop-blur-md rounded-2xl border border-dashed border-white/50">
            <Package className="h-8 w-8 text-sage-400 mx-auto" />
            <p className="mt-2 text-sm text-sage-600 font-semibold">Nenhum sabonete sob esta categoria no momento.</p>
            <button
              onClick={() => setSelectedCategory("Todos")}
              className="mt-3 text-xs bg-[#2d5a27] text-white px-5 py-2.5 rounded-full cursor-pointer"
            >
              Mostrar Todos
            </button>
          </div>
        )}

      </div>

      {/* CUSTOM POPUPS FOR DIALOG SAFETY (No window.alert/window.confirm as requested by system constraints) */}
      {activeNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sage-950/40 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl max-w-sm w-full border border-white/65 shadow-2xl relative text-center space-y-4">
            <button onClick={() => setActiveNotification(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 bg-[#ffe600]/20 text-[#2d3277] rounded-full flex items-center justify-center mx-auto">
              <ExternalLink className="h-5 w-5" />
            </div>
            <h4 className="font-display font-black text-lg text-sage-950">{activeNotification.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-light">{activeNotification.message}</p>
            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => setActiveNotification(null)}
                className="w-full py-3 rounded-full text-xs font-bold text-[#2d3277] bg-[#ffe600] uppercase tracking-wider cursor-pointer"
              >
                Prosseguir para Mercado Livre
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sage-950/45 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl max-w-sm w-full border border-white/60 shadow-2xl relative text-center space-y-4">
            <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="h-5 w-5" />
            </div>
            <h4 className="font-display font-black text-lg text-sage-950">Excluir Produto?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Você tem certeza de que deseja apagar permanentemente esse sabonete do seu catálogo local?</p>
            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="w-1/2 py-3 rounded-full text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 cursor-pointer"
              >
                Voltar
              </button>
              <button 
                onClick={() => {
                  onDeleteProduct(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="w-1/2 py-3 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow-md"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
