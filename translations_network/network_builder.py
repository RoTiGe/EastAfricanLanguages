"""
Network-based prioritization system for language learning.
Builds a graph connecting personas, categories, and sentences for smart prioritization.
"""

import json
import networkx as nx
from pathlib import Path
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple, Optional

class LanguageLearningNetwork:
    """Creates and manages a network of learning priorities."""
    
    def __init__(self, categories_file: str = None):
        """Initialize the network."""
        self.G = nx.DiGraph()
        self.categories_data = None
        
        if categories_file is None:
            categories_file = Path(__file__).parent / "categories.json"
        
        self.load_categories(categories_file)
        self.build_network()
    
    def load_categories(self, filepath: str):
        """Load categories and personas from JSON file."""
        with open(filepath, 'r', encoding='utf-8') as f:
            self.categories_data = json.load(f)
    
    def build_network(self):
        """Build the complete network graph."""
        # Add root node
        self.G.add_node("ROOT", type="root", priority=0)
        
        # Add persona nodes
        for persona in self.categories_data['personas']:
            persona_id = persona['id']
            self.G.add_node(
                persona_id,
                type="persona",
                name=persona['name'],
                description=persona['description']
            )
            self.G.add_edge("ROOT", persona_id, weight=1.0)
        
        # Add category nodes and connect to personas
        for category in self.categories_data['categories']:
            cat_id = category['id']
            priority = category['priority']
            
            self.G.add_node(
                cat_id,
                type="category",
                name=category['name'],
                priority=priority,
                description=category['description'],
                subcategories=category['subcategories']
            )
            
            # Connect categories to relevant personas
            for persona in self.categories_data['personas']:
                persona_id = persona['id']
                
                # Check if this category applies to this persona
                if category['personas'][0] == "all" or persona_id in category['personas']:
                    # Get weight from persona's priority weights
                    weight = persona.get('priority_weights', {}).get(cat_id, 0.5)
                    
                    if weight > 0:
                        # Edge weight combines category priority and persona-specific weight
                        # Lower priority number = higher importance, so invert it
                        priority_score = 1.0 / priority
                        combined_weight = priority_score * weight
                        
                        self.G.add_edge(
                            persona_id,
                            cat_id,
                            weight=combined_weight,
                            priority=priority,
                            persona_weight=weight
                        )
            
            # Add subcategory nodes
            for subcat in category['subcategories']:
                subcat_id = f"{cat_id}.{subcat}"
                self.G.add_node(
                    subcat_id,
                    type="subcategory",
                    name=subcat.replace('_', ' ').title(),
                    parent_category=cat_id
                )
                self.G.add_edge(cat_id, subcat_id, weight=1.0)
    
    def get_personalized_priorities(self, persona_id: str, top_n: int = 10) -> List[Tuple[str, float]]:
        """Get prioritized categories for a specific persona."""
        if persona_id not in self.G:
            raise ValueError(f"Persona '{persona_id}' not found in network")
        
        # Get all categories connected to this persona
        categories = []
        for successor in self.G.successors(persona_id):
            if self.G.nodes[successor]['type'] == 'category':
                edge_data = self.G[persona_id][successor]
                priority = self.G.nodes[successor]['priority']
                weight = edge_data['weight']
                
                categories.append({
                    'id': successor,
                    'name': self.G.nodes[successor]['name'],
                    'priority': priority,
                    'weight': weight,
                    'persona_weight': edge_data['persona_weight']
                })
        
        # Sort by weight (descending) and then by priority (ascending)
        categories.sort(key=lambda x: (-x['weight'], x['priority']))
        
        return [(cat['id'], cat['weight']) for cat in categories[:top_n]]
    
    def get_learning_path(self, persona_id: str) -> List[Dict]:
        """Generate a recommended learning path for a persona."""
        priorities = self.get_personalized_priorities(persona_id, top_n=20)
        
        learning_path = []
        for cat_id, weight in priorities:
            cat_node = self.G.nodes[cat_id]
            learning_path.append({
                'category_id': cat_id,
                'category_name': cat_node['name'],
                'priority': cat_node['priority'],
                'weight': weight,
                'description': cat_node['description'],
                'subcategories': cat_node['subcategories']
            })
        
        return learning_path
    
    def get_all_personas(self) -> List[Dict]:
        """Get list of all available personas."""
        personas = []
        for node_id in self.G.nodes():
            node = self.G.nodes[node_id]
            if node['type'] == 'persona':
                personas.append({
                    'id': node_id,
                    'name': node['name'],
                    'description': node['description']
                })
        return personas
    
    def get_category_info(self, category_id: str) -> Optional[Dict]:
        """Get detailed information about a category."""
        if category_id not in self.G:
            return None
        
        node = self.G.nodes[category_id]
        if node['type'] != 'category':
            return None
        
        # Get all personas that use this category
        relevant_personas = []
        for persona_id in self.G.predecessors(category_id):
            if self.G.nodes[persona_id]['type'] == 'persona':
                edge_data = self.G[persona_id][category_id]
                relevant_personas.append({
                    'id': persona_id,
                    'name': self.G.nodes[persona_id]['name'],
                    'weight': edge_data['persona_weight']
                })
        
        return {
            'id': category_id,
            'name': node['name'],
            'priority': node['priority'],
            'description': node['description'],
            'subcategories': node['subcategories'],
            'relevant_personas': relevant_personas
        }
    
    def visualize_network(self, output_file: str = None, persona_filter: str = None):
        """Create a visualization of the network."""
        plt.figure(figsize=(20, 16))
        
        # Create subgraph if filtering by persona
        if persona_filter:
            if persona_filter not in self.G:
                raise ValueError(f"Persona '{persona_filter}' not found")
            
            # Get nodes within 2 hops of the persona
            nodes = set([persona_filter])
            nodes.add("ROOT")
            for successor in self.G.successors(persona_filter):
                nodes.add(successor)
                for sub_successor in self.G.successors(successor):
                    nodes.add(sub_successor)
            
            G_viz = self.G.subgraph(nodes)
        else:
            G_viz = self.G
        
        # Position nodes using hierarchical layout
        pos = nx.spring_layout(G_viz, k=2, iterations=50, seed=42)
        
        # Color nodes by type
        color_map = {
            'root': '#FF6B6B',
            'persona': '#4ECDC4',
            'category': '#95E1D3',
            'subcategory': '#F3E8D0'
        }
        
        node_colors = [color_map.get(G_viz.nodes[node].get('type', 'unknown'), '#CCCCCC') 
                      for node in G_viz.nodes()]
        
        # Draw nodes
        nx.draw_networkx_nodes(G_viz, pos, node_color=node_colors, 
                              node_size=1000, alpha=0.9)
        
        # Draw edges with varying thickness based on weight
        edges = G_viz.edges()
        weights = [G_viz[u][v].get('weight', 0.5) for u, v in edges]
        nx.draw_networkx_edges(G_viz, pos, width=[w*3 for w in weights], 
                              alpha=0.5, arrows=True, arrowsize=15)
        
        # Draw labels
        labels = {node: G_viz.nodes[node].get('name', node) 
                 if G_viz.nodes[node]['type'] in ['persona', 'category'] 
                 else '' 
                 for node in G_viz.nodes()}
        nx.draw_networkx_labels(G_viz, pos, labels, font_size=8)
        
        plt.title(f"Language Learning Network" + 
                 (f" - {persona_filter}" if persona_filter else ""), 
                 fontsize=16)
        plt.axis('off')
        plt.tight_layout()
        
        if output_file:
            plt.savefig(output_file, dpi=300, bbox_inches='tight')
            print(f"Network visualization saved to {output_file}")
        else:
            plt.show()
    
    def export_to_json(self, output_file: str):
        """Export the network structure to JSON for use in web applications."""
        export_data = {
            'nodes': [],
            'edges': [],
            'personas': self.get_all_personas()
        }
        
        # Export nodes
        for node_id in self.G.nodes():
            node = self.G.nodes[node_id]
            export_data['nodes'].append({
                'id': node_id,
                'type': node['type'],
                **{k: v for k, v in node.items() if k != 'type'}
            })
        
        # Export edges
        for source, target in self.G.edges():
            edge = self.G[source][target]
            export_data['edges'].append({
                'source': source,
                'target': target,
                **edge
            })
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        print(f"Network exported to {output_file}")
    
    def get_network_stats(self) -> Dict:
        """Get statistics about the network."""
        return {
            'total_nodes': self.G.number_of_nodes(),
            'total_edges': self.G.number_of_edges(),
            'personas': len([n for n in self.G.nodes() 
                           if self.G.nodes[n]['type'] == 'persona']),
            'categories': len([n for n in self.G.nodes() 
                             if self.G.nodes[n]['type'] == 'category']),
            'subcategories': len([n for n in self.G.nodes() 
                                if self.G.nodes[n]['type'] == 'subcategory']),
            'avg_degree': sum(dict(self.G.degree()).values()) / self.G.number_of_nodes(),
            'density': nx.density(self.G)
        }


def main():
    """Example usage of the LanguageLearningNetwork."""
    # Create network
    network = LanguageLearningNetwork()
    
    # Print network statistics
    print("Network Statistics:")
    print("-" * 50)
    stats = network.get_network_stats()
    for key, value in stats.items():
        print(f"{key}: {value}")
    print()
    
    # Get all personas
    print("Available Personas:")
    print("-" * 50)
    personas = network.get_all_personas()
    for persona in personas:
        print(f"- {persona['name']}: {persona['description']}")
    print()
    
    # Example: Get learning path for an asylum seeker
    print("Learning Path for Asylum Seeker:")
    print("-" * 50)
    learning_path = network.get_learning_path('asylum_seeker')
    for i, item in enumerate(learning_path[:10], 1):
        print(f"{i}. {item['category_name']} (Priority: {item['priority']}, Weight: {item['weight']:.3f})")
        print(f"   {item['description']}")
        print()
    
    # Example: Get learning path for a house maid
    print("Learning Path for House Maid:")
    print("-" * 50)
    learning_path = network.get_learning_path('house_maid')
    for i, item in enumerate(learning_path[:10], 1):
        print(f"{i}. {item['category_name']} (Priority: {item['priority']}, Weight: {item['weight']:.3f})")
        print(f"   {item['description']}")
        print()
    
    # Export network for web use
    output_dir = Path(__file__).parent
    network.export_to_json(str(output_dir / "network_data.json"))
    
    # Visualize (optional - requires matplotlib)
    try:
        network.visualize_network(
            output_file=str(output_dir / "network_visualization.png"),
            persona_filter='asylum_seeker'
        )
    except Exception as e:
        print(f"Visualization skipped: {e}")


if __name__ == "__main__":
    main()
