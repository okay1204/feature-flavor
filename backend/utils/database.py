from typing import Tuple

class MissingSentinel:
    """
    Sentinel class to represent missing/undefined values.
    Used for optional parameters in GraphQL mutations where None is a valid value.
    """
    def __repr__(self):
        return "MISSING"
    
    def __str__(self):
        return "MISSING"
    
    def __int__(self):
        return 0

# Global instance to use as a sentinel
MISSING = MissingSentinel()

def build_update_query(table_name: str, id_param: str, updates: dict, id_value) -> Tuple[str, list]:
    """
    Build a dynamic SQL UPDATE query that only updates fields that are not MISSING.
    
    Args:
        table_name: Name of the table to update
        id_param: Name of the ID column (e.g., 'id')
        updates: Dictionary of field_name -> value pairs, where value can be MISSING
        id_value: The ID value to filter by
        
    Returns:
        Tuple of (query_string, parameters_list)
        
    Example:
        query, params = build_update_query(
            'leads', 
            'id', 
            {'state': LeadStatus.APPROVED, 'offer': MISSING}, 
            lead_id
        )
    """
    update_parts = []
    params = [id_value]
    
    for field_name, value in updates.items():
        if value is not MISSING:
            # Handle enum values that need .value
            if hasattr(value, 'value'):
                param_value = value.value
            else:
                param_value = value
                
            params.append(param_value)
            update_parts.append(f"{field_name} = ${len(params)}")
    
    if not update_parts:
        # No fields to update, return a SELECT query instead
        query = f"""
            SELECT * FROM {table_name}
            WHERE {id_param} = $1
        """
    else:
        query = f"""
            UPDATE {table_name}
            SET {', '.join(update_parts)}
            WHERE {id_param} = $1
            RETURNING *
        """
    
    return query, params
