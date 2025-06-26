import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialProducts = [
  {
    id: '1',
    name: 'Smartphone',
    image: 'https://via.placeholder.com/100',
    price: 180000,
    stock: 5,
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Sneakers',
    image: 'https://via.placeholder.com/100',
    price: 95000,
    stock: 8,
    category: 'Shoes',
  },
  {
    id: '3',
    name: 'Lotion',
    image: 'https://via.placeholder.com/100',
    price: 12000,
    stock: 0,
    category: 'Beauty',
  },
];

export default function TraderProductsScreen() {
  const [categories, setCategories] = useState(['All', 'Electronics', 'Shoes', 'Beauty']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState(initialProducts);

  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'All',
    image: '',
  });

  // Filter products by category
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Handle editing (placeholder)
  const handleEdit = (id) => {
    Alert.alert('Edit', `Edit product with id: ${id}`);
  };

  // Handle deleting product
  const handleDelete = (id) => {
    Alert.alert('Delete', `Delete product with id: ${id}`);
  };

  // Add new category from modal
  const addCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }
    if (categories.includes(trimmed)) {
      Alert.alert('Error', 'Category already exists.');
      return;
    }
    setCategories([...categories, trimmed]);
    setSelectedCategory(trimmed);
    setNewCategoryName('');
    setAddCategoryModalVisible(false);
  };

  // Add new product from modal
  const addProduct = () => {
    // Basic validation
    if (
      !newProduct.name.trim() ||
      !newProduct.price ||
      isNaN(Number(newProduct.price)) ||
      !newProduct.stock ||
      isNaN(Number(newProduct.stock)) ||
      !newProduct.category ||
      newProduct.category === 'All'
    ) {
      Alert.alert('Error', 'Please fill all fields correctly and select a category.');
      return;
    }

    const newProdObj = {
      id: (products.length + 1).toString(),
      name: newProduct.name.trim(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      category: newProduct.category,
      image:
        newProduct.image.trim() ||
        'https://via.placeholder.com/100', // default image if empty
    };

    setProducts([newProdObj, ...products]);
    setAddProductModalVisible(false);
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      category: 'All',
      image: '',
    });
    setSelectedCategory(newProdObj.category);
  };

  // Render categories including Add button
  const renderCategory = (cat) => {
    if (cat === 'AddButton') {
      return (
        <TouchableOpacity
          key="addBtn"
          onPress={() => setAddCategoryModalVisible(true)}
          style={[styles.categoryBtn, styles.categoryAddBtn]}
        >
          <Ionicons name="add" size={14} color="#333" />
          <Text style={[styles.categoryText, { marginLeft: 4 }]}>Add</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={cat}
        style={[
          styles.categoryBtn,
          selectedCategory === cat && styles.categoryBtnActive,
        ]}
        onPress={() => setSelectedCategory(cat)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === cat && styles.categoryTextActive,
          ]}
        >
          {cat}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render product cards
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>RWF {item.price.toLocaleString()}</Text>

        <View
          style={[
            styles.stockBadge,
            { backgroundColor: item.stock > 0 ? '#7FE8C9' : '#F76D6D' },
          ]}
        >
          <Text style={styles.stockBadgeText}>
            {item.stock > 0 ? `Stock: ${item.stock}` : 'Out of stock'}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={16} color="#000" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={16} color="#F76D6D" />
            <Text style={[styles.actionText, { color: '#F76D6D' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Products</Text>
        <View style={styles.topRight}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {categories.map(renderCategory)}
        {renderCategory('AddButton')}
      </ScrollView>

      {/* Add Product Button */}
      <View style={styles.addButtonRow}>
        <Text style={styles.subTitle}>
          Showing {filteredProducts.length} product(s)
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddProductModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Category Modal */}
      <Modal
        visible={addCategoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              placeholder="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.input}
            />
            <View style={styles.modalBtnRow}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setAddCategoryModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={addCategory}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        visible={addProductModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            <TextInput
              placeholder="Product name"
              value={newProduct.name}
              onChangeText={(text) =>
                setNewProduct((prev) => ({ ...prev, name: text }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Price (RWF)"
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={(text) =>
                setNewProduct((prev) => ({ ...prev, price: text }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Stock quantity"
              keyboardType="numeric"
              value={newProduct.stock}
              onChangeText={(text) =>
                setNewProduct((prev) => ({ ...prev, stock: text }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Image URL (optional)"
              value={newProduct.image}
              onChangeText={(text) =>
                setNewProduct((prev) => ({ ...prev, image: text }))
              }
              style={styles.input}
            />

            <Text style={{ marginBottom: 6, fontWeight: '600' }}>
              Select Category:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories
                .filter((c) => c !== 'All')
                .map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryBtn,
                      newProduct.category === cat && styles.categoryBtnActive,
                      { marginBottom: 12 },
                    ]}
                    onPress={() => setNewProduct((prev) => ({ ...prev, category: cat }))}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        newProduct.category === cat && styles.categoryTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setAddProductModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={addProduct}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Add</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: '#333',
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryBtn: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: '#7FE8C9',
    borderColor: '#7FE8C9',
  },
  categoryText: {
    fontSize: 13,
    color: '#333',
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  categoryAddBtn: {
    borderStyle: 'dashed',
    borderColor: '#aaa',
  },
  addButtonRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#7FE8C9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    marginBottom: 20,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  price: {
    fontWeight: '600',
    fontSize: 14,
    color: '#7FE8C9',
  },
  stockBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
    color: '#000',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#7FE8C9',
  },
  modalBtnText: {
    fontWeight: '600',
  },
});
