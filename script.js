// script.js
// Data storage
let focusAreas = [];
let budgetData = {
   q1: 0, q2: 0, q3: 0, q4: 0,
   holdbackPercent: 0,
   exception1: { 
       name: '', 
       q1: 0, q2: 0, q3: 0, q4: 0,
       total: 0
   },
   exception2: { 
       name: '', 
       q1: 0, q2: 0, q3: 0, q4: 0,
       total: 0
   }
};

// Tab Navigation
function showTab(tabName) {
   const contents = document.querySelectorAll('.tab-content');
   contents.forEach(content => content.classList.remove('active'));
   
   const tabs = document.querySelectorAll('.tab');
   tabs.forEach(tab => tab.classList.remove('active'));
   
   document.getElementById(tabName).classList.add('active');
   event.target.classList.add('active');

   if (tabName === 'allocation') {
       updateAllocationSummary();
   } else if (tabName === 'overview') {
       updateOverview();
       generateQuarterlyTable();
   }
}

// Budget Calculations
function calculateBudgets() {
   updateBudgetData();
   updateBudgetDisplays();
   updateAllocationSummary();
}

function updateBudgetData() {
   budgetData.q1 = parseFloat(document.getElementById('q1-budget').value) || 0;
   budgetData.q2 = parseFloat(document.getElementById('q2-budget').value) || 0;
   budgetData.q3 = parseFloat(document.getElementById('q3-budget').value) || 0;
   budgetData.q4 = parseFloat(document.getElementById('q4-budget').value) || 0;
   budgetData.holdbackPercent = parseFloat(document.getElementById('holdback-percent').value) || 0;
   
   // Update exception 1
   budgetData.exception1.name = document.getElementById('exception1-name').value;
   budgetData.exception1.q1 = parseFloat(document.getElementById('exception1-q1').value) || 0;
   budgetData.exception1.q2 = parseFloat(document.getElementById('exception1-q2').value) || 0;
   budgetData.exception1.q3 = parseFloat(document.getElementById('exception1-q3').value) || 0;
   budgetData.exception1.q4 = parseFloat(document.getElementById('exception1-q4').value) || 0;
   budgetData.exception1.total = budgetData.exception1.q1 + budgetData.exception1.q2 + budgetData.exception1.q3 + budgetData.exception1.q4;
   
   // Update exception 2
   budgetData.exception2.name = document.getElementById('exception2-name').value;
   budgetData.exception2.q1 = parseFloat(document.getElementById('exception2-q1').value) || 0;
   budgetData.exception2.q2 = parseFloat(document.getElementById('exception2-q2').value) || 0;
   budgetData.exception2.q3 = parseFloat(document.getElementById('exception2-q3').value) || 0;
   budgetData.exception2.q4 = parseFloat(document.getElementById('exception2-q4').value) || 0;
   budgetData.exception2.total = budgetData.exception2.q1 + budgetData.exception2.q2 + budgetData.exception2.q3 + budgetData.exception2.q4;
}

function updateBudgetDisplays() {
   const totalAnnual = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
   const totalHoldback = totalAnnual * (budgetData.holdbackPercent / 100);
   const afterHoldback = totalAnnual - totalHoldback;
   const totalExceptions = budgetData.exception1.total + budgetData.exception2.total;
   const remainingAfterExceptions = Math.max(0, afterHoldback - totalExceptions);
   
   document.getElementById('total-annual-budget').textContent = '$' + totalAnnual.toLocaleString();
   document.getElementById('total-holdback').textContent = '$' + totalHoldback.toLocaleString();
   document.getElementById('available-allocation').textContent = '$' + afterHoldback.toLocaleString();
   document.getElementById('remaining-after-exceptions').textContent = '$' + remainingAfterExceptions.toLocaleString();
   document.getElementById('exception1-total').textContent = '$' + budgetData.exception1.total.toLocaleString();
   document.getElementById('exception2-total').textContent = '$' + budgetData.exception2.total.toLocaleString();
}

// Focus Area Management
function toggleAllocationMethod() {
   const method = document.getElementById('allocation-method').value;
   document.getElementById('custom-amount-section').style.display = method === 'custom' ? 'block' : 'none';
   document.getElementById('percentage-section').style.display = method === 'percentage' ? 'block' : 'none';
}

function addFocusArea() {
   const name = document.getElementById('focus-area-name').value;
   const members = parseInt(document.getElementById('focus-area-members').value) || 1;
   const method = document.getElementById('allocation-method').value;
   const notes = document.getElementById('focus-area-notes').value;
   
   if (!name) {
       alert('Please enter a focus area name');
       return;
   }
   
   let annualBudget = 0;
   const remainingBudget = getRemainingBudgetForAllocation();
   
   if (method === 'equal') {
       const totalMembers = getTotalMembersInAllAreas() + members;
       const totalAnnual = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
       const totalHoldback = totalAnnual * (budgetData.holdbackPercent / 100);
       const afterHoldback = totalAnnual - totalHoldback;
       const totalExceptions = budgetData.exception1.total + budgetData.exception2.total;
       const availableForDistribution = afterHoldback - totalExceptions;
       
       annualBudget = totalMembers > 0 ? (availableForDistribution / totalMembers) * members : 0;
   } else if (method === 'custom') {
       annualBudget = parseFloat(document.getElementById('custom-amount').value) || 0;
   } else if (method === 'percentage') {
       const percentage = parseFloat(document.getElementById('percentage-amount').value) || 0;
       annualBudget = remainingBudget * (percentage / 100);
   }
   
   const focusArea = {
       id: Date.now(),
       name,
       members,
       method,
       annualBudget,
       notes,
       quarterlyBudgets: calculateQuarterlyBudgets(annualBudget)
   };
   
   focusAreas.push(focusArea);
   updateFocusAreasList();
   clearFocusAreaForm();
   updateAllocationSummary();
   
   if (method === 'equal') {
       recalculateEqualDistribution();
   }
}

function calculateQuarterlyBudgets(annualBudget) {
   const totalQuarterly = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
   if (totalQuarterly === 0) return { q1: 0, q2: 0, q3: 0, q4: 0 };
   
   return {
       q1: (annualBudget * budgetData.q1) / totalQuarterly,
       q2: (annualBudget * budgetData.q2) / totalQuarterly,
       q3: (annualBudget * budgetData.q3) / totalQuarterly,
       q4: (annualBudget * budgetData.q4) / totalQuarterly
   };
}

function getRemainingBudgetForAllocation() {
   const totalAnnual = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
   const totalHoldback = totalAnnual * (budgetData.holdbackPercent / 100);
   const afterHoldback = totalAnnual - totalHoldback;
   const totalExceptions = budgetData.exception1.total + budgetData.exception2.total;
   const totalAllocated = focusAreas.reduce((sum, area) => sum + area.annualBudget, 0);
   
   return Math.max(0, afterHoldback - totalExceptions - totalAllocated);
}

function getTotalMembersInAllAreas() {
   return focusAreas.reduce((sum, area) => sum + area.members, 0);
}

function recalculateEqualDistribution() {
   const totalAnnual = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
   const totalHoldback = totalAnnual * (budgetData.holdbackPercent / 100);
   const afterHoldback = totalAnnual - totalHoldback;
   const totalExceptions = budgetData.exception1.total + budgetData.exception2.total;
   const availableForDistribution = afterHoldback - totalExceptions;
   
   const totalMembers = getTotalMembersInAllAreas();
   
   focusAreas.forEach(area => {
       if (area.method === 'equal') {
           const budgetPerPerson = totalMembers > 0 ? availableForDistribution / totalMembers : 0;
           area.annualBudget = budgetPerPerson * area.members;
           area.quarterlyBudgets = calculateQuarterlyBudgets(area.annualBudget);
       }
   });
   
   updateFocusAreasList();
}

function updateFocusAreasList() {
   const container = document.getElementById('focus-areas-list');
   
   if (focusAreas.length === 0) {
       container.innerHTML = '<p style="color: #718096; text-align: center; padding: 20px;">No focus areas added yet. Add your first focus area to get started.</p>';
       return;
   }

   container.innerHTML = focusAreas.map(area => `
       <div class="vendor-item">
           <button class="delete-btn" onclick="deleteFocusArea(${area.id})">×</button>
           <h4>${area.name}</h4>
           <div class="vendor-details">
               <span><strong>Team Members:</strong> ${area.members}</span>
               <span><strong>Method:</strong> ${area.method.charAt(0).toUpperCase() + area.method.slice(1)}</span>
               <span><strong>Annual Budget:</strong> $${area.annualBudget.toLocaleString()}</span>
               <span><strong>Per Person:</strong> $${(area.annualBudget / area.members).toLocaleString()}</span>
               ${area.notes ? `<span><strong>Notes:</strong> ${area.notes}</span>` : ''}
           </div>
       </div>
   `).join('');
}

function deleteFocusArea(id) {
   focusAreas = focusAreas.filter(area => area.id !== id);
   updateFocusAreasList();
   updateAllocationSummary();
   recalculateEqualDistribution();
}

function clearFocusAreaForm() {
   document.getElementById('focus-area-name').value = '';
   document.getElementById('focus-area-members').value = '1';
   document.getElementById('allocation-method').value = 'equal';
   document.getElementById('custom-amount').value = '0';
   document.getElementById('percentage-amount').value = '0';
   document.getElementById('focus-area-notes').value = '';
   
   document.getElementById('custom-amount-section').style.display = 'none';
   document.getElementById('percentage-section').style.display = 'none';
}

function updateAllocationSummary() {
   const summaryDiv = document.getElementById('allocation-summary');
   
   if (focusAreas.length === 0) {
       summaryDiv.style.display = 'none';
       return;
   }
   
   summaryDiv.style.display = 'block';
   
   const totalAllocated = focusAreas.reduce((sum, area) => sum + area.annualBudget, 0);
   const remaining = getRemainingBudgetForAllocation();
   
   document.getElementById('total-allocated').textContent = '$' + totalAllocated.toLocaleString();
   document.getElementById('remaining-unallocated').textContent = '$' + remaining.toLocaleString();
}

// Overview and Export Functions
function updateOverview() {
   const totalAnnual = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
   const totalHoldback = totalAnnual * (budgetData.holdbackPercent / 100);
   const totalExceptions = budgetData.exception1.total + budgetData.exception2.total;
   const totalFocusAreas = focusAreas.reduce((sum, area) => sum + area.annualBudget, 0);
   
   document.getElementById('overview-total-budget').textContent = '$' + totalAnnual.toLocaleString();
   document.getElementById('overview-holdback').textContent = '$' + totalHoldback.toLocaleString();
   document.getElementById('overview-exceptions').textContent = '$' + totalExceptions.toLocaleString();
   document.getElementById('overview-focus-areas').textContent = '$' + totalFocusAreas.toLocaleString();
}

function generateQuarterlyTable() {
    const tableContainer = document.getElementById('quarterly-table');
    
    let tableHTML = `
        <table width=100%>
            <thead>
                <tr>
                    <th>Budget Category</th>
                    <th>Q1 </th>
                    <th>Q2 </th>
                    <th>Q3 </th>
                    <th>Q4 </th>
                    <th>Annual Total</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let totalQ1 = 0, totalQ2 = 0, totalQ3 = 0, totalQ4 = 0, totalAnnual = 0;
    
    // 1. Total Budget Row
    const totalBudgetAnnual = budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4;
    tableHTML += `
        <tr style="background-color: #f0f9ff; font-weight: 600;">
            <td><strong>Total Budget</strong></td>
            <td><strong>$${budgetData.q1.toLocaleString()}</strong></td>
            <td><strong>$${budgetData.q2.toLocaleString()}</strong></td>
            <td><strong>$${budgetData.q3.toLocaleString()}</strong></td>
            <td><strong>$${budgetData.q4.toLocaleString()}</strong></td>
            <td><strong>$${totalBudgetAnnual.toLocaleString()}</strong></td>
        </tr>
    `;
    
    // 2. Holdback Row
    if (budgetData.holdbackPercent > 0) {
        const holdbackQ1 = budgetData.q1 * (budgetData.holdbackPercent / 100);
        const holdbackQ2 = budgetData.q2 * (budgetData.holdbackPercent / 100);
        const holdbackQ3 = budgetData.q3 * (budgetData.holdbackPercent / 100);
        const holdbackQ4 = budgetData.q4 * (budgetData.holdbackPercent / 100);
        const holdbackTotal = holdbackQ1 + holdbackQ2 + holdbackQ3 + holdbackQ4;
        
        tableHTML += `
            <tr>
                <td><em>Holdback Reserve (${budgetData.holdbackPercent}%)</em></td>
                <td>$${Math.round(holdbackQ1).toLocaleString()}</td>
                <td>$${Math.round(holdbackQ2).toLocaleString()}</td>
                <td>$${Math.round(holdbackQ3).toLocaleString()}</td>
                <td>$${Math.round(holdbackQ4).toLocaleString()}</td>
                <td>$${Math.round(holdbackTotal).toLocaleString()}</td>
            </tr>
        `;
        
        totalQ1 += holdbackQ1;
        totalQ2 += holdbackQ2;
        totalQ3 += holdbackQ3;
        totalQ4 += holdbackQ4;
        totalAnnual += holdbackTotal;
    }
    
    // 3. Exception 1 Row
    if (budgetData.exception1.name && budgetData.exception1.total > 0) {
        tableHTML += `
            <tr>
                <td><em>${budgetData.exception1.name}</em></td>
                <td>$${budgetData.exception1.q1.toLocaleString()}</td>
                <td>$${budgetData.exception1.q2.toLocaleString()}</td>
                <td>$${budgetData.exception1.q3.toLocaleString()}</td>
                <td>$${budgetData.exception1.q4.toLocaleString()}</td>
                <td>$${budgetData.exception1.total.toLocaleString()}</td>
            </tr>
        `;
        
        totalQ1 += budgetData.exception1.q1;
        totalQ2 += budgetData.exception1.q2;
        totalQ3 += budgetData.exception1.q3;
        totalQ4 += budgetData.exception1.q4;
        totalAnnual += budgetData.exception1.total;
    }
    
    // 4. Exception 2 Row
    if (budgetData.exception2.name && budgetData.exception2.total > 0) {
        tableHTML += `
            <tr>
                <td><em>${budgetData.exception2.name}</em></td>
                <td>$${budgetData.exception2.q1.toLocaleString()}</td>
                <td>$${budgetData.exception2.q2.toLocaleString()}</td>
                <td>$${budgetData.exception2.q3.toLocaleString()}</td>
                <td>$${budgetData.exception2.q4.toLocaleString()}</td>
                <td>$${budgetData.exception2.total.toLocaleString()}</td>
            </tr>
        `;
        
        totalQ1 += budgetData.exception2.q1;
        totalQ2 += budgetData.exception2.q2;
        totalQ3 += budgetData.exception2.q3;
        totalQ4 += budgetData.exception2.q4;
        totalAnnual += budgetData.exception2.total;
    }
    
    // 5. Focus Areas (sorted by name for consistency)
    const sortedFocusAreas = [...focusAreas].sort((a, b) => a.name.localeCompare(b.name));
    sortedFocusAreas.forEach(area => {
        tableHTML += `
            <tr>
                <td>${area.name}</td>
                <td>$${Math.round(area.quarterlyBudgets.q1).toLocaleString()}</td>
                <td>$${Math.round(area.quarterlyBudgets.q2).toLocaleString()}</td>
                <td>$${Math.round(area.quarterlyBudgets.q3).toLocaleString()}</td>
                <td>$${Math.round(area.quarterlyBudgets.q4).toLocaleString()}</td>
                <td>$${Math.round(area.annualBudget).toLocaleString()}</td>
            </tr>
        `;
        
        totalQ1 += area.quarterlyBudgets.q1;
        totalQ2 += area.quarterlyBudgets.q2;
        totalQ3 += area.quarterlyBudgets.q3;
        totalQ4 += area.quarterlyBudgets.q4;
        totalAnnual += area.annualBudget;
    });
    
    // 6. Total Allocated Row
    tableHTML += `
                <tr class="total-row">
                    <td><strong>TOTAL ALLOCATED</strong></td>
                    <td><strong>$${Math.round(totalQ1).toLocaleString()}</strong></td>
                    <td><strong>$${Math.round(totalQ2).toLocaleString()}</strong></td>
                    <td><strong>$${Math.round(totalQ3).toLocaleString()}</strong></td>
                    <td><strong>$${Math.round(totalQ4).toLocaleString()}</strong></td>
                    <td><strong>$${Math.round(totalAnnual).toLocaleString()}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
    
    // Show message if no data
    if (focusAreas.length === 0 && budgetData.exception1.total === 0 && budgetData.exception2.total === 0) {
        tableHTML = '<p style="color: #718096; text-align: center; padding: 20px;">No focus areas or exceptions to display. Add focus areas to see quarterly breakdown.</p>';
    }
    
    tableContainer.innerHTML = tableHTML;
}

function exportQuarterlyBreakdown() {
   let csvContent = 'Quarterly Budget Breakdown\n\n';
   csvContent += 'Focus Area / Exception,Team Members,Q1 Budget,Q2 Budget,Q3 Budget,Q4 Budget,Annual Total\n';
   
   focusAreas.forEach(area => {
       csvContent += `"${area.name}",${area.members},$${Math.round(area.quarterlyBudgets.q1)},$${Math.round(area.quarterlyBudgets.q2)},$${Math.round(area.quarterlyBudgets.q3)},$${Math.round(area.quarterlyBudgets.q4)},$${Math.round(area.annualBudget)}\n`;
   });
   
   if (budgetData.exception1.name && budgetData.exception1.total > 0) {
       csvContent += `"${budgetData.exception1.name}",-,$${budgetData.exception1.q1},$${budgetData.exception1.q2},$${budgetData.exception1.q3},$${budgetData.exception1.q4},$${budgetData.exception1.total}\n`;
   }
   
   if (budgetData.exception2.name && budgetData.exception2.total > 0) {
       csvContent += `"${budgetData.exception2.name}",-,$${budgetData.exception2.q1},$${budgetData.exception2.q2},$${budgetData.exception2.q3},$${budgetData.exception2.q4},$${budgetData.exception2.total}\n`;
   }
   
   const holdbackTotal = (budgetData.q1 + budgetData.q2 + budgetData.q3 + budgetData.q4) * (budgetData.holdbackPercent / 100);
   if (holdbackTotal > 0) {
       const holdbackQ1 = budgetData.q1 * (budgetData.holdbackPercent / 100);
       const holdbackQ2 = budgetData.q2 * (budgetData.holdbackPercent / 100);
       const holdbackQ3 = budgetData.q3 * (budgetData.holdbackPercent / 100);
       const holdbackQ4 = budgetData.q4 * (budgetData.holdbackPercent / 100);
       csvContent += `"Holdback Reserve (${budgetData.holdbackPercent}%)",-,$${holdbackQ1},$${holdbackQ2},$${holdbackQ3},$${holdbackQ4},$${holdbackTotal}\n`;
   }
   
   downloadCSV(csvContent, 'quarterly_budget_breakdown.csv');
}

function downloadCSV(csvContent, filename) {
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
   const link = document.createElement('a');
   const url = URL.createObjectURL(blob);
   link.setAttribute('href', url);
   link.setAttribute('download', filename);
   link.style.visibility = 'hidden';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
   calculateBudgets();
});