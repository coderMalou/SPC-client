<template>
  <div class="company-selector" ref="selectorRef">
    <div class="selector-trigger" @click="toggleDropdown">
      <span class="selected-value">{{ selectedLabel }}</span>
      <svg 
        class="arrow-icon" 
        :class="{ 'arrow-up': isOpen }" 
        width="16" 
        height="16" 
        viewBox="0 0 48 48" 
        fill="none"
      >
        <path d="M39.6 17.444L24.044 33 8.487 17.444" stroke="currentColor" stroke-width="4"/>
      </svg>
    </div>
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-list">
        <div 
          v-for="item in companies" 
          :key="item.id"
          class="dropdown-item"
          :class="{ 'is-selected': item.name === modelValue }"
          @click="selectCompany(item)"
        >
          {{ item.name }}
          <svg v-if="item.name === modelValue" class="check-icon" width="16" height="16" viewBox="0 0 48 48" fill="none">
            <path d="M10 24L20 34L38 14" stroke="currentColor" stroke-width="4"/>
          </svg>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Company {
  name: string;
  id: number;
}

const props = defineProps<{
  modelValue: string;
  companies: Company[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const selectorRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const found = props.companies.find(item => item.name === props.modelValue);
  return found?.name || '请选择公司';
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCompany = (item: Company) => {
  emit('update:modelValue', item.name);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.company-selector {
  position: relative;
  width: 140px;
  user-select: none;
}

.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #001529;
  font-size: 14px;
}

.selector-trigger:hover {
  background: #f5f5f5;
}

.arrow-icon {
  color: #4E5969;
  transition: transform 0.2s ease;
}

.arrow-icon.arrow-up {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 10000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  color: #001529;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.is-selected {
  background: #e6f7ff;
  color: #1890ff;
}

.check-icon {
  color: #1890ff;
}

/* Transition animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Scrollbar styling */
.dropdown-list::-webkit-scrollbar {
  width: 6px;
}

.dropdown-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dropdown-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .company-selector {
    width: 100px;
  }

  .selector-trigger {
    height: 28px;
    font-size: 12px;
    padding: 0 8px;
  }

  .dropdown-item {
    font-size: 12px;
    padding: 8px 10px;
  }
}

@media (max-width: 480px) {
  .company-selector {
    width: 80px;
  }

  .selector-trigger {
    height: 26px;
    font-size: 11px;
    padding: 0 6px;
  }

  .dropdown-item {
    font-size: 11px;
    padding: 6px 8px;
  }
}
</style>
