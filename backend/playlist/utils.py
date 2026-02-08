# playlist/utils.py

def calculate_position(prev_position=None, next_position=None):
    """
    Calculate position for inserting between two items.
    
    This is the REQUIRED algorithm from the assignment spec.
    
    Examples:
        calculate_position(1.0, 2.0)       -> 1.5
        calculate_position(None, 1.0)      -> 0.0
        calculate_position(2.0, None)      -> 3.0
        calculate_position(1.0, 1.5)       -> 1.25
        calculate_position(None, None)     -> 1.0
    
    Args:
        prev_position: Position of item before insertion point (None if first)
        next_position: Position of item after insertion point (None if last)
    
    Returns:
        Float position that maintains sort order
    """
    if prev_position is None and next_position is None:
        return 1.0
    
    if prev_position is None:
        return next_position - 1
    
    if next_position is None:
        return prev_position + 1
    
    return (prev_position + next_position) / 2